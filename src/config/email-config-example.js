/*
  Exemplo de Configuração do E-mail

  Este é um exemplo de arquivo de configuração para envio de e-mails. 
  Crie um arquivo chamado "email-config.json" na pasta "config" do seu projeto e preencha as informações conforme necessário.

  [GMAIL]
  Se você estiver usando o Gmail como provedor de e-mail, preencha as informações da seguinte maneira:

  {
    "service": "gmail",
    "auth": {
      "user": "[seu-endereco-de-email]",
      "pass": "[sua-senha-do-email]"
    }
  }

  [PADRÃO]
  Se você estiver usando um provedor de e-mail padrão, preencha as informações da seguinte maneira:

  {
    "host": "[servidor-de-smtp]",
    "port": [porta-de-smtp],
    "secure": [true-ou-false],
    "auth": {
      "user": "[seu-endereco-de-email]",
      "pass": "[sua-senha-do-email]"
    }
  }
*/
