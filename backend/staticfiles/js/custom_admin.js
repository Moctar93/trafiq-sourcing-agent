document.addEventListener("DOMContentLoaded", function () {
    // Selection du lien pushmenu et de son icône
    var toggleLink = document.querySelector('a[data-widget="pushmenu"]');
    if (toggleLink) {
        var icon = toggleLink.querySelector('i');
        if (icon) {
            // Force le remplacement immédiat
            icon.className = "fas fa-arrow-left";

            // Alterne entre flèche gauche et flèche droite au clic
            toggleLink.addEventListener("click", function () {
                setTimeout(function () {
                    if (document.body.classList.contains("sidebar-collapse")) {
                        icon.className = "fas fa-arrow-right";
                    } else {
                        icon.className = "fas fa-arrow-left";
                    }
                }, 100);
            });
        }
    }

    // 2. Intercepter la déconnexion en POST
    document.addEventListener("click", function (e) {
        var target = e.target.closest('a[href*="/admin/logout/"]');
        if (target) {
            e.preventDefault();

            var form = document.createElement("form");
            form.method = "POST";
            form.action = target.href;

            var csrfToken = getCookie("csrftoken");
            if (csrfToken) {
                var csrfInput = document.createElement("input");
                csrfInput.type = "hidden";
                csrfInput.name = "csrfmiddlewaretoken";
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
            }

            document.body.appendChild(form);
            form.submit();
        }
    });
});

// Helper pour récupérer le cookie CSRF Django
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}