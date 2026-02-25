import urllib.request
import json

def get_wiki_image(query):
    # Use MediaWiki API to search for images
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(query)}&gsrlimit=1&prop=imageinfo&iiprop=url&format=json"
    try:
        req = urllib.request.urlopen(url)
        res = json.loads(req.read())
        pages = res.get("query", {}).get("pages", {})
        for page_id in pages:
            image_url = pages[page_id]["imageinfo"][0]["url"]
            print(f"{query}: {image_url}")
            return image_url
    except Exception as e:
        print(f"Failed {query}: {e}")
        return None

queries = [
    "Le Sirenuse Positano",
    "La Sponda Positano",
    "Positano sunset balcony",
    "Riva Aquarama",
    "Capri Blue Grotto",
    "Capri lemon tree restaurant",
    "Villa Cimbrone ravello",
    "Palazzo Avino",
    "Mercedes V-Class black"
]

for q in queries:
    get_wiki_image(q)

