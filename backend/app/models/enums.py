"""
Enumeration types for the application.
"""

from enum import Enum


class PriceType(str, Enum):
    """Price currency types."""

    AMD = "AMD"
    RUB = "RUB"
    USD = "USD"
    EUR = "EUR"


class AdvType(str, Enum):
    """Territory types."""

    SALE = "sale"
    RENT = "rent"
    SHORT_RENT = "short_rent"
    LONG_RENT = "long_rent"


class PropertyType(str, Enum):
    """Property types."""

    COMMERCIAL = "commercial"
    COTTAGE = "cottage"
    APARTMENT = "apartment"
    HOUSE = "house"
    TOWN_HOUSE = "town_house"



class LocationType(str, Enum):
    """Territory types."""

    FOREIGN = "Արտերկիր"
    ARMENIAN = "Հայաստան"

class WorldRegionType(str, Enum):
    """World region types."""

    EUROPE = "Եվրոպա"
    ASIA = "Ասիա"
    AMERICA_NORTH = "Հյուսիսային Ամերիկա"


class ArmenianRegion(str, Enum):
    """Armenian regions (marzer)."""

    YEREVAN = "Երևան"
    ARAGATSOTN = "Արագածոտնի մարզ"
    ARARAT = "Արարատի մարզ"
    ARMAVIR = "Արմավիրի մարզ"
    GEGHARKUNIK = "Գեղարքունիքի մարզ"
    KOTAYK = "Կոտայքի մարզ"
    LORI = "Լոռու մարզ"
    SHIRAK = "Շիրակի մարզ"
    SYUNIK = "Սյունիքի մարզ"
    TAVUSH = "Տավուշի մարզ"
    VAYOTS_DZOR = "Վայոց Ձորի մարզ"
    FOREIGN = "Արտերկիր"


class ArmenianCity(str, Enum):
    """Armenian cities."""
    
    # Yerevan
    YEREVAN = "Երևան"
    
    # Aragatsotn Region
    ASHTARAK = "Աշտարակ"
    APARAN = "Ապարան"
    TALIN = "Թալին"
    
    # Ararat Region
    ARTASHAT = "Արտաշատ"
    MASIS = "Մասիս"
    VEDI = "Վեդի"
    
    # Armavir Region
    ARMAVIR = "Արմավիր"
    ECHMIADZIN = "Էջմիածին"
    METSAMOR = "Մեծամոր"
    
    # Gegharkunik Region
    GAVAR = "Գավառ"
    SEVAN = "Սևան"
    MARTUNI = "Մարտունի"
    VARDENIS = "Վարդենիս"
    
    # Lori Region
    VANADZOR = "Վանաձոր"
    ALAVERDI = "Ալավերդի"
    STEPANAVAN = "Ստեփանավան"
    TASHIR = "Տաշիր"
    SPITAK = "Սպիտակ"
    
    # Kotayk Region
    HRAZDAN = "Հրազդան"
    ABOVYAN = "Աբովյան"
    CHARENTSAVAN = "Չարենցավան"
    NOR_HACHN = "Նոր Հաճն"
    YEGHVARD = "Եղվարդ"
    BYUREGHAVAN = "Բյուրեղավան"
    
    # Shirak Region
    GYUMRI = "Գյումրի"
    ARTIK = "Արթիկ"
    MARALIK = "Մարալիկ"
    
    # Syunik Region
    KAPAN = "Կապան"
    GORIS = "Գորիս"
    MEGHRI = "Մեղրի"
    SISIAN = "Սիսիան"
    AGARAK = "Ագարակ"
    DASTAKERT = "Դաստակերտ"
    
    # Tavush Region
    IJEVAN = "Իջևան"
    BERD = "Բերդ"
    NOYEMBERYAN = "Նոյեմբերյան"
    DILIJAN = "Դիլիջան"
    
    # Vayots Dzor Region
    YEGHEGNADZOR = "Եղեգնաձոր"
    VAYK = "Վայք"
    JERMUK = "Ջերմուկ"


class ForeignCountry(str, Enum):
    """Foreign countries."""
    
    ALBANIA = "Ալբանիա"
    ANDORRA = "Անդորրա"
    ENGLAND = "Անգլիա"
    AUSTRIA = "Ավստրիա"
    BELARUS = "Բելառուս"
    BELGIUM = "Բելգիա"
    BOSNIA_HERZEGOVINA = "Բոսնիա և Հերցեգովինա"
    BULGARIA = "Բուլղարիա"
    VATICAN = "Վատիկան"
    GERMANY = "Գերմանիա"
    GEORGIA = "Վրաստան"
    DENMARK = "Դանիա"
    ESTONIA = "Էստոնիա"
    IRELAND = "Իռլանդիա"
    ICELAND = "Իսլանդիա"
    SPAIN = "Իսպանիա"
    ITALY = "Իտալիա"
    CYPRUS = "Կիպրոս"
    LATVIA = "Լատվիա"
    LIECHTENSTEIN = "Լիխտենշտեյն"
    LITHUANIA = "Լիտվա"
    LUXEMBOURG = "Լյուքսեմբուրգ"
    MACEDONIA = "Մակեդոնիա"
    MALTA = "Մալթա"
    MOLDOVA = "Մոլդովա"
    MONACO = "Մոնակո"
    MONTENEGRO = "Մոնտենեգրո"
    NORWAY = "Նորվեգիա"
    NETHERLANDS = "Նիդերլանդներ"
    POLAND = "Լեհաստան"
    PORTUGAL = "Պորտուգալիա"
    ROMANIA = "Ռումինիա"
    RUSSIA = "Ռուսաստան"
    SAN_MARINO = "Սան Մարինո"
    SERBIA = "Սերբիա"
    SLOVAKIA = "Սլովակիա"
    SLOVENIA = "Սլովենիա"
    FINLAND = "Ֆինլանդիա"
    FRANCE = "Ֆրանսիա"
    CROATIA = "Խորվաթիա"
    CZECH_REPUBLIC = "Չեխիա"
    SWEDEN = "Շվեդիա"
    SWITZERLAND = "Շվեյցարիա"
    UKRAINE = "Ուկրաինիա"
    GREECE = "Հունաստան"
    HUNGARY = "Հունգարիա"
    UAE = "Արաբական Միացյալ Էմիրություններ"