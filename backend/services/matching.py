
def calculate_match_score(waste, generator_company, consumer_company):
    """Calcula score de compatibilidade baseado em múltiplos fatores"""
    chemical_compatibility = {
        ("Borra Oleosa", "Cimpor Suape"): 0.98,
        ("Catalisador FCC Exausto", "Cimpor Suape"): 0.85,
        ("Lodo de ETE Industrial", "Bunge Alimentos"): 0.75,
        ("Resíduos de PET", "Mossi & Ghisolfi"): 0.95,
        ("Óleo de Soja Usado", "Termopernambuco"): 0.88,
        ("Sucata Metálica Naval", "White Martins"): 0.82,
        ("Cinzas de Caldeira", "Cimpor Suape"): 0.90,
        ("CO2 Industrial", "PetroquímicaSuape"): 0.92
    }
    
    geographic_score = 0.95
    
    economic_score = min(1.0, waste["price_per_unit"] / 1000)
    
    chem_score = chemical_compatibility.get((waste["name"], consumer_company["name"]), 0.7)
    final_score = (chem_score * 0.4) + (geographic_score * 0.3) + (economic_score * 0.3)
    
    return round(final_score * 100, 1)