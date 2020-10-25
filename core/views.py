from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render

# Create your views here.
def dark1(request, plantilla="dark-01.html"):
    return render(request, plantilla)

def login(request):
    return render(request, "login.html")


def form(request, plantilla="form.html"):
    return render(request, plantilla)