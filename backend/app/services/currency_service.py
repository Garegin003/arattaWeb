
from app.schemas.home import HomeBase
from app.models.enums import PriceType



def convert_to_amd(currency_code: str, amount: float, data: dict):
    """Convert from specified currency to AMD."""
    if currency_code.lower() == "amd":
        return amount
        
    entry = data.get(currency_code.lower())
    if not entry:
        # Fallback to hardcoded values if API data is missing
        hardcoded_rates = {
            "usd": 400.0,
            "eur": 430.0,
            "rub": 4.5
        }

        rate = hardcoded_rates.get(currency_code.lower())
        if not rate:
            raise ValueError(f"No info about currency: {currency_code}")
        return amount * rate
    return amount * (entry["rate"])**-1

def convert_from_amd(target_currency: str, amd_amount: float, data: dict):
    """Convert from AMD to specified currency."""
    if target_currency.lower() == "amd":
        return amd_amount
        
    entry = data.get(target_currency.lower())
    if not entry:
        # Fallback to hardcoded values if API data is missing
        hardcoded_rates = {
            "usd": 400.0,
            "eur": 430.0,
            "rub": 4.5
        }

        rate = hardcoded_rates.get(target_currency.lower())
        if not rate:
            raise ValueError(f"No info about currency: {target_currency}")
        return amd_amount / rate
    return amd_amount * entry["rate"]

def get_home_with_price_amd(home, data):
    # Convert original price to AMD first
    price_amd = home.price
    if home.price_type != PriceType.AMD:
        price_amd = int(convert_to_amd(home.price_type.value.lower(), home.price, data))
    
    # Calculate prices in other currencies from AMD
    try:
        price_usd = int(convert_from_amd("usd", price_amd, data))
        price_eur = int(convert_from_amd("eur", price_amd, data))
        price_rub = int(convert_from_amd("rub", price_amd, data))
    except (ValueError, KeyError):
        # Fallback values if conversion fails
        price_usd = int(price_amd / 400.0)
        price_eur = int(price_amd / 430.0)
        price_rub = int(price_amd / 4.5)
    
    return HomeBase(
        **home.__dict__,
        price_amd=price_amd,
        price_usd=price_usd,
        price_eur=price_eur,
        price_rub=price_rub
    )