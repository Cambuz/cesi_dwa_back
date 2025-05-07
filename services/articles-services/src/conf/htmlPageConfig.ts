export const getHtmlPage = () => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Articles Service</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 40px;
                        background-color: #f5f5f5;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333;
                    }
                    .links {
                        margin-top: 20px;
                    }
                    a {
                        color: #0066cc;
                        text-decoration: none;
                        margin-right: 15px;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Articles Service API</h1>
                    <p>Bienvenue sur le service de gestion des articles</p>
                    <div class="links">
                        <a href="/swagger">Documentation API</a>
                        <a href="/articles">Liste des articles</a>
                        <a href="/menus">Liste des menus</a>
                    </div>
                </div>
            </body>
        </html>
    `;
}; 