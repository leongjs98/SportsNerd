from django import template

register = template.Library()

@register.filter
def format_date(date):
    return date.replace("T00:00:00", "")