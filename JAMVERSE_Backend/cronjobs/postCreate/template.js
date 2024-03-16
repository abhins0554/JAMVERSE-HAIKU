module.exports = ({ userPofileImage1, userPofileImage2, userPofileImage3, userText1, userText2, userText3, userFullName1, userFullName2, userFullName3}) => {
    return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Formal Modern Card</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f0f0f0;
                    /* Background color */
                }
            
                .card {
                    width: 300px;
                    padding: 20px;
                    background: #f7f7f7;
                    /* Light gray background for a clean look */
                    border: 1px solid #e0e0e0;
                    /* Subtle border for separation */
                    text-align: center;
                }
            
                .card-content {
                    padding: 10px;
                }
            
                .card-text {
                    font-size: 16px;
                    margin: 10px 0;
                    color: #333;
                    /* Darker text color for readability */
                    font-weight: 600;
                }
            
                .user-profiles {
                    display: flex;
                    justify-content: space-around;
                    margin: 20px 0;
                }
            
                .user-profile {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            
                .user-profile img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin: 5px 0;
                }
            
                .user-name {
                    font-size: 14px;
                    margin: 0;
                    color: #555;
                    /* Slightly darker text color for user names */
                }
            
                .branding {
                    background-color: #f7f7f7;
                    /* Light gray background for branding */
                    padding: 10px;
                }
            
                .branding p {
                    font-size: 14px;
                    margin: 0;
                    color: #555;
                    /* Slightly darker text color for branding */
                    text-align: end;
                }
            </style>
        </head>
            
        <body>
            <div class="card" id="card-image-png">
                <div class="card-content">
                    <p class="card-text">${userText1}</p>
                    <p class="card-text">${userText2}</p>
                    <p class="card-text">${userText3}</p>
                </div>
                <div class="user-profiles">
                    <div class="user-profile">
                        <img src="${userPofileImage1}"
                            alt="${userFullName1}">
                        <p class="user-name">${userFullName1}</p>
                    </div>
                    <div class="user-profile">
                        <img src="${userPofileImage2}"
                            alt="${userFullName2}">
                        <p class="user-name">${userFullName2}</p>
                    </div>
                    <div class="user-profile">
                        <img src="${userPofileImage3}"
                            alt="${userFullName3}">
                        <p class="user-name">${userFullName3}</p>
                    </div>
                </div>
                <div class="branding">
                    <p>JAMVERSE.IN</p>
                </div>
            </div>
        </body>
            
        </html>
    `;
}