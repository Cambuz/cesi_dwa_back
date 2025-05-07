export const getHtmlPage = (): string => {
  return `
    <html>
      <head>
        <title>Restaurant API Manager</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            display: inline-block;
          }
          h1 {
            color: #333;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 18px;
            color: white;
            background: #007bff;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
          }
          a:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p>Explorez et testez les endpoints de l'API grâce à Swagger.</p>
          <a href="/swagger">📄 Voir la documentation</a>
        </div>
      </body>
    </html>
  `;
};