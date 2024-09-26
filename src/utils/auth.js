import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute
  } from 'amazon-cognito-identity-js';
  import AWS from 'aws-sdk';
  
  // Ensure the environment variables are set correctly
  const poolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    ClientId: process.env.REACT_APP_AUTH_APP_CLIENT_ID,
  };
  
  const userPool = new CognitoUserPool(poolData);

  AWS.config.update({
    region: process.env.REACT_APP_REGION_NAME,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
  });
  
  export const signIn = (username, password) => {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });
  
      const userData = {
        Username: username,
        Pool: userPool,
      };
  
      const cognitoUser = new CognitoUser(userData);
  
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };  
  
  export const getUserAttributes = (cognitoUser) => {
    return new Promise((resolve, reject) => {
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
        } else {
          const result = {};
          attributes.forEach(attribute => {
            result[attribute.Name] = attribute.Value;
          });
          resolve(result);
        }
      });
    });
  };

  export const signUp = (name, email, password) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'name', Value: name }),
        new CognitoUserAttribute({ Name: 'email', Value: email }),
      ];
  
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
  };
  
  export const confirmSignup = (cognitoUser, confirmationCode) => {
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
  
  export const logoutUser = () => {
    let cognitoUser = userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (!cognitoUser) {
        console.error('No user is currently authenticated.');
        return reject('No user is currently authenticated.');
      }
  
      cognitoUser.signOut();
      resolve('Logged out successfully.');
    });
  };
  