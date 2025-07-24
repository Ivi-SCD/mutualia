def calculate_roi(waste_type, volume, disposal_cost, market_price):
    expense = volume * disposal_cost
    revenue = volume * market_price
    profit = revenue - expense
    investment = 1500
    payback_days = int((investment / profit) * 30) if profit > 0 else 0
    return {
        "waste_type": waste_type,
        "volume": volume,
        "disposal_cost": disposal_cost,
        "market_price": market_price,
        "potential_profit": profit,
        "payback_days": max(7, payback_days),
        "roi_percentage": round((profit / investment) * 100, 1) if investment > 0 else 0
    }