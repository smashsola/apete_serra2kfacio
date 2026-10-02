# APETÊ para Android — primeira versão para o estande

Aplicativo Android em Java, importável no Android Studio. Usa uma WebView que abre o APETÊ publicado por HTTPS: o catálogo, pedidos e Sabiá continuam no mesmo sistema. Esta versão depende de internet; não é uma reescrita nativa em Flutter e não está publicada na Play Store.

Requisitos de build: JDK 17, Android SDK com plataforma 35, Gradle 8.9 (wrapper incluído). Android mínimo: 8.0 / API 26. Não solicita localização, câmera, contatos ou armazenamento. Não inclui chaves privadas. As sessões ficam no armazenamento da WebView, separado do navegador. Depois de confirmar o e-mail no navegador, pode ser necessário entrar novamente no app.

## Construir

Abra esta pasta no Android Studio, aguarde a sincronização e use Build APK(s). Pelo terminal, configure JAVA_HOME e ANDROID_HOME e execute `./gradlew.bat assembleDebug`. Saída: `app/build/outputs/apk/debug/app-debug.apk`.

## Instalar por USB

No celular, habilite opções de desenvolvedor e depuração USB; conecte o cabo e autorize o computador na tela do telefone. Execute `instalar-no-celular.ps1` nesta pasta. O script só instala se houver exatamente um aparelho autorizado. Com vários aparelhos, use `-Serial` com o identificador desejado. O APK de debug é assinado para testes; não é uma publicação comercial.

Para instalar sem cabo, transfira o APK ao telefone e abra-o, autorizando a instalação pelo aplicativo usado para abrir o arquivo quando o Android solicitar.

## Verificação

Build e assinatura podem ser verificados no computador. Em aparelho: abrir app, login, retorno após alternar de aplicativo, Sabiá, sacola e histórico, links externos, botão Voltar, rotação e falta de internet seguida de Tentar novamente. Confirmar cadastro por e-mail exige uma caixa de teste acessível. Essas verificações em telefone ainda dependem de um dispositivo conectado.
