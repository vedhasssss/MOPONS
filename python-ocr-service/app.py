"""
Flask microservice for coupon OCR and data extraction
Uses EasyOCR for text extraction and regex for parsing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import re
from datetime import datetime
import os
import base64
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for Node.js integration

# Initialize EasyOCR reader (only once for performance)
print("🔄 Initializing EasyOCR reader...")
reader = easyocr.Reader(['en'], gpu=False)  # Set gpu=True if you have CUDA
print("✅ EasyOCR reader initialized!")

def extract_text_from_image(image_bytes):
    """Extract all text from image using EasyOCR"""
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Perform OCR
        results = reader.readtext(image_bytes)
        
        # Extract text with confidence scores
        text_data = []
        for (bbox, text, confidence) in results:
            text_data.append({
                'text': text,
                'confidence': float(confidence)
            })
        
        # Combine all text
        full_text = ' '.join([item['text'] for item in text_data])
        
        return {
            'success': True,
            'full_text': full_text,
            'text_data': text_data
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def parse_coupon_details(text_data, full_text):
    """
    Intelligently parse coupon details from extracted text
    """
    
    # Combine text for easier searching
    text_lower = full_text.lower()
    
    # Extract brand (usually first prominent text or contains known brands)
    brand = None
    known_brands = ['amazon', 'flipkart', 'swiggy', 'zomato', 'uber', 'dominos', 'pizza hut', 'mcdonald']
    for item in text_data[:5]:  # Check first 5 text items
        for known_brand in known_brands:
            if known_brand in item['text'].lower():
                brand = item['text']
                break
        if brand:
            break
    
    # If no known brand, use first text as brand
    if not brand and text_data:
        brand = text_data[0]['text']
    
    # Extract discount percentage
    discount_percentage = None
    discount_patterns = [
        r'(\d+)%\s*(?:off|discount)',
        r'(\d+)\s*percent',
        r'(\d+)%'
    ]
    for pattern in discount_patterns:
        match = re.search(pattern, text_lower)
        if match:
            discount_percentage = int(match.group(1))
            break
    
    # Extract prices (₹ symbol or numbers)
    prices = []
    price_patterns = [
        r'₹\s*(\d+(?:,\d+)*)',
        r'rs\.?\s*(\d+(?:,\d+)*)',
        r'\b(\d{3,5})\b'  # 3-5 digit numbers (likely prices)
    ]
    for pattern in price_patterns:
        matches = re.findall(pattern, full_text)
        for match in matches:
            price = int(match.replace(',', ''))
            if 50 <= price <= 999999:  # Reasonable price range
                prices.append(price)
    
    # Original and sale price logic
    original_price = None
    sale_price = None
    if len(prices) >= 2:
        prices.sort(reverse=True)
        original_price = prices[0]
        sale_price = prices[1] if prices[1] < prices[0] else None
    elif len(prices) == 1:
        original_price = prices[0]
    
    # Extract coupon code (usually alphanumeric, 4-15 chars, uppercase)
    coupon_code = None
    code_patterns = [
        r'\b([A-Z0-9]{4,15})\b',  # Uppercase alphanumeric
        r'code[:\s]+([A-Z0-9]+)',  # Preceded by "code"
        r'use[:\s]+([A-Z0-9]+)'    # Preceded by "use"
    ]
    
    # Look for potential codes in high-confidence text
    for item in text_data:
        if item['confidence'] > 0.7:
            text = item['text'].strip()
            # Check if it looks like a coupon code
            if 4 <= len(text) <= 15 and text.isupper() and any(c.isdigit() for c in text) and any(c.isalpha() for c in text):
                coupon_code = text
                break
    
    # If not found, try regex patterns
    if not coupon_code:
        for pattern in code_patterns:
            match = re.search(pattern, full_text)
            if match:
                coupon_code = match.group(1)
                break
    
    # Extract expiry date
    expiry_date = None
    date_patterns = [
        r'valid\s+until[:\s]+(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4})',
        r'expires?[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        r'(\d{4}-\d{2}-\d{2})'
    ]
    for pattern in date_patterns:
        match = re.search(pattern, text_lower)
        if match:
            expiry_date = match.group(1)
            break
    
    # Create title
    title = None
    if discount_percentage and brand:
        title = f"{discount_percentage}% off at {brand}"
    elif discount_percentage:
        title = f"{discount_percentage}% discount coupon"
    elif brand:
        title = f"{brand} coupon"
    else:
        title = "Discount coupon"
    
    # Extract description (combine relevant text)
    description_parts = []
    for item in text_data[:3]:  # First few items usually have the offer
        if 'off' in item['text'].lower() or '%' in item['text'] or 'discount' in item['text'].lower():
            description_parts.append(item['text'])
    description = ' '.join(description_parts) if description_parts else f"{discount_percentage}% discount offer"
    
    # Extract terms and conditions (usually small text at bottom)
    terms = None
    for item in text_data[-3:]:  # Last few items
        text = item['text']
        if any(word in text.lower() for word in ['minimum', 'valid', 'cannot', 'terms', 'conditions', 'not valid']):
            terms = text
            break
    
    return {
        'title': title,
        'brand': brand,
        'description': description[:200] if description else None,  # Limit length
        'discountPercentage': discount_percentage,
        'originalPrice': original_price,
        'sellingPrice': sale_price,
        'couponCode': coupon_code,
        'expiryDate': expiry_date,
        'termsAndConditions': terms
    }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Python OCR Service',
        'version': '1.0.0'
    })

@app.route('/extract-coupon', methods=['POST'])
def extract_coupon():
    """
    Extract coupon details from uploaded image
    Accepts: multipart/form-data with 'image' field
    Returns: JSON with extracted coupon details
    """
    try:
        # Check if image is in request
        if 'image' not in request.files:
            # Try base64 encoded image
            if request.json and 'image' in request.json:
                image_base64 = request.json['image']
                image_bytes = base64.b64decode(image_base64)
            else:
                return jsonify({
                    'success': False,
                    'message': 'No image provided'
                }), 400
        else:
            # Get image from multipart form
            image_file = request.files['image']
            image_bytes = image_file.read()
        
        print(f"📸 Processing image ({len(image_bytes)} bytes)...")
        
        # Extract text using OCR
        ocr_result = extract_text_from_image(image_bytes)
        
        if not ocr_result['success']:
            return jsonify({
                'success': False,
                'message': 'OCR extraction failed',
                'error': ocr_result.get('error')
            }), 500
        
        print(f"📝 Extracted text: {ocr_result['full_text'][:100]}...")
        
        # Parse coupon details
        coupon_data = parse_coupon_details(
            ocr_result['text_data'],
            ocr_result['full_text']
        )
        
        print(f"✅ Parsed coupon data: {coupon_data}")
        
        return jsonify({
            'success': True,
            'data': coupon_data,
            'raw_text': ocr_result['full_text'],
            'debug': {
                'text_items_count': len(ocr_result['text_data']),
                'avg_confidence': sum(item['confidence'] for item in ocr_result['text_data']) / len(ocr_result['text_data']) if ocr_result['text_data'] else 0
            }
        })
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🐍 Python OCR Service Starting...")
    print("="*60 + "\n")
    
    # Run Flask server
    app.run(
        host='0.0.0.0',
        port=5001,  # Different port from Node.js (5000)
        debug=False  # Changed to False to avoid .env loading issues
    )
