document.addEventListener("DOMContentLoaded", function() {
    var $gallery = window.jQuery('#media'); 
    if(!$gallery.length) return;

    // 1. Destruir la instancia por defecto creada por el tema 'cards'
    var lgData = $gallery.data('lightGallery');
    if (lgData) {
        $gallery.data('lightGallery').destroy(true);
    }

    // 2. Cargar dinámicamente el plugin lg-hash desde CDN
    var script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lightgallery/1.10.0/js/lg-hash.min.js";
    document.body.appendChild(script);

    script.onload = function() {
        // 3. Reinicializar LightGallery con hash activado
        $gallery.lightGallery({
            hash: true,
            galleryId: 1,
            mode: 'lg-fade',
            download: true,
            counter: true
        });

        // 4. Inyectar botón "Copiar URL" al abrir foto
        $gallery.on('onAfterOpen.lg', function(event) {
            var iconSvg = '<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:currentColor; padding-top:4px;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
            var copyBtnHtml = '<button id="btn-copy-url" class="lg-icon" aria-label="Copiar URL" title="Copiar enlace de esta foto" style="background:none; border:none; color:#ccc; cursor:pointer; transition: color 0.3s;">' + iconSvg + '</button>';
            
            if (!window.jQuery('#btn-copy-url').length) {
                window.jQuery('.lg-toolbar').append(copyBtnHtml);

                window.jQuery('#btn-copy-url').on('click', function() {
                    var currentUrl = window.location.href;
                    navigator.clipboard.writeText(currentUrl).then(function() {
                        var btn = window.jQuery('#btn-copy-url');
                        btn.css('color', '#C8102E'); // Rojo corporativo
                        setTimeout(function() {
                            btn.css('color', '#ccc');
                        }, 1500);
                    });
                });
            }
        });
    };
});