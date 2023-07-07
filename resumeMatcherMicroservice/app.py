from flask import Flask, request, jsonify
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
import re

app = Flask(__name__)

# Connexion à la base de données MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['Welyne']
collection = db['resumes']
collection1 = db['dataset']

# Entraînement du modèle Word2Vec sur les compétences des freelancers
freelancers = []  # Liste pour stocker les freelancers

for freelancer in collection.find():
    # Ajouter les compétences extraites du CV dans le format approprié
    skills = freelancer['skills'][0].split(',')
    skills = [skill.strip().lower() for skill in skills]
    freelancer_data = {
        'name': freelancer['name'],
        'skills': skills
    }
    freelancers.append(freelancer_data)


# Élimination des redondances
pipeline = [
    {
        '$group': {
            '_id': '$field_to_check_for_duplicates',
            'unique_documents': {
                '$addToSet': '$$ROOT'
            }
        }
    },
    {
        '$replaceRoot': {
            'newRoot': {
                '$arrayElemAt': ['$unique_documents', 0]
            }
        }
    }
]

# Exécution de la mise à jour avec l'opération $group
collection1.aggregate(pipeline) 


# Nettoyage de l'attribut "skills"
regex_pattern = re.compile(r'^(?!.*mot_clé1|mot_clé2|mot_clé3).*$', re.IGNORECASE)

# Récupération des documents nécessitant une mise à jour
documents = collection1.find({'skills': {'$regex': regex_pattern}})

# Mise à jour des documents
for document in documents:
    updated_skills = [skill for skill in document['skills'] if re.match(regex_pattern, skill)]
    collection1.update_one({'_id': document['_id']}, {'$set': {'skills': updated_skills}})

resumes = []

for resume in collection1.find():
    skills = resume['Key Skills'].split('|')
    skills = [skill.strip().lower() for skill in skills]
    resume_data = {
        'skills': skills
    }
    resumes.append(resume_data)

sentences = [resume['skills'] for resume in resumes]
print(sentences)
model = Word2Vec(sentences, min_count=1)

@app.route('/match', methods=['POST'])
def match_freelancers():
    data = request.json
    competences_requises = data['skills']
    competences_requises = [skill.strip().lower() for skill in competences_requises]

    # Liste pour stocker les scores de similarité
    scores = []

    # Comparaison des compétences requises avec les compétences des freelancers
    for freelancer in freelancers:
        similarity_score = model.wv.n_similarity(competences_requises, freelancer['skills'])
        scores.append((freelancer['name'], float(similarity_score)))  # Conversion du score en float

    # Trier les freelancers en fonction des scores de similarité
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    # Renvoyer les freelancers correspondants
    result = [{'name': name, 'score': score} for name, score in scores]
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001)  # Définissez le port souhaité ici
