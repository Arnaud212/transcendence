
from django.shortcuts import redirect
from django.contrib import messages
from functools import wraps

def email_verified_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('account_login')
        if not request.user.email_verified:
            messages.error(request, "Please verify your email address to access this page.")
            return redirect('account_email')
        return view_func(request, *args, **kwargs)
    return _wrapped_view
