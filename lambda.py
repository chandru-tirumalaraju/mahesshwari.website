import json

# Quiz data
QUIZ_DATA = {
    "alice": {
        "questions": [
            {
                "id": 1,
                "text": "What is Alice's favorite color?",
                "options": ["Blue", "Red", "Green", "Yellow"],
                "correctAnswer": "Blue"
            },
            {
                "id": 2,
                "text": "What is Alice's favorite season?",
                "options": ["Spring", "Summer", "Fall", "Winter"],
                "correctAnswer": "Spring"
            }
        ],
        "correctImage": "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1",
        "allCorrectImage": "https://images.unsplash.com/photo-1490730141103-6cac27aaab94"
    },
    "bob": {
        "questions": [
            {
                "id": 1,
                "text": "What is Bob's favorite sport?",
                "options": ["Football", "Basketball", "Tennis", "Soccer"],
                "correctAnswer": "Basketball"
            },
            {
                "id": 2,
                "text": "What is Bob's favorite food?",
                "options": ["Pizza", "Burger", "Sushi", "Pasta"],
                "correctAnswer": "Pizza"
            }
        ],
        "correctImage": "https://images.unsplash.com/photo-1546519638-68e109498ffc",
        "allCorrectImage": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131"
    }
}

def lambda_handler(event, context):
    # Get the person name from the path parameters
    person_name = event['pathParameters']['name'].lower()
    
    # Get the answers from the request body
    body = json.loads(event['body'])
    answers = body.get('answers', [])
    
    if person_name not in QUIZ_DATA:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Person not found'})
        }
    
    person_data = QUIZ_DATA[person_name]
    correct_count = 0
    
    # Check answers
    for i, answer in enumerate(answers):
        if i < len(person_data['questions']) and answer == person_data['questions'][i]['correctAnswer']:
            correct_count += 1
    
    # Determine which image to return
    result_image = None
    if correct_count == 2:
        result_image = person_data['allCorrectImage']
    elif correct_count == 1:
        result_image = person_data['correctImage']
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps({
            'correctCount': correct_count,
            'resultImage': result_image
        })
    }
