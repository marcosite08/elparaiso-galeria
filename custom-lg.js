(function() {
    // Esperar a que LightGallery esté listo
    function init() {
        var $gallery = window.jQuery('#media');
        if (!$gallery.length) return;

        // Escuchar cuando se abre el lightbox
        $gallery.on('onAfterOpen.lg', function() {
            addCopyButton();
            updateUrlHash();
        });

        // Escuchar cuando cambia de slide
        $gallery.on('onAfterSlide.lg', function(event, prevIndex, index) {
            updateUrlHash(index);
        });

        // Escuchar cuando se cierra el lightbox
        $gallery.on('onCloseAfter.lg', function() {
            // Limpiar el hash de la URL
            if (window.history.pushState) {
                window.history.pushState('', document.title, window.location.pathname);
            }
        });
    }

    function updateUrlHash(index) {
        var lgInstance = window.jQuery('#media').data('lightGallery');
        if (lgInstance) {
            var currentIndex = (index !== undefined) ? index : lgInstance.index;
            var newUrl = window.location.pathname + '#lg=1&slide=' + currentIndex;
            if (window.history.replaceState) {
                window.history.replaceState(null, null, newUrl);
            }
        }
    }

    function addCopyButton() {
        if (window.jQuery('#btn-copy-url').length) return; // Ya existe

        var iconSvg = '<svg viewBox="0 0 24 24" style="width:22px; height:22px; fill:currentColor;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
        
        var copyBtn = window.jQuery('<button id="btn-copy-url" class="lg-icon" title="Copiar enlace de esta foto" style="background:none; border:none; color:#999; cursor:pointer; padding:10px; transition: color 0.3s;"></button>');
        copyBtn.html(iconSvg);
        
        copyBtn.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var url = window.location.href;
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function() {
                    showFeedback(copyBtn);
                });
            } else {
                // Fallback para navegadores antiguos
                var input = document.createElement('input');
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                showFeedback(copyBtn);
            }
        });

        window.jQuery('.lg-toolbar').prepend(copyBtn);
    }

    function showFeedback(btn) {
        btn.css('color', '#C8102E'); // Rojo corporativo
        setTimeout(function() {
            btn.css('color', '#999');
        }, 1500);
    }

    // Verificar si hay hash en la URL al cargar
    function checkUrlHash() {
        var hash = window.location.hash;
        if (hash && hash.indexOf('slide=') > -1) {
            var match = hash.match(/slide=(\d+)/);
            if (match) {
                var slideIndex = parseInt(match[1]);
                var $gallery = window.jQuery('#media');
                if ($gallery.length) {
                    // Abrir lightbox en el slide indicado
                    setTimeout(function() {
                        $gallery.find('li').eq(slideIndex).find('a').trigger('click');
                    }, 500);
                }
            }
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            checkUrlHash();
        });
    } else {
        init();
        checkUrlHash();
    }
})();