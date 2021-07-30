let OpenIDClient = require("openid-client");
let { TokenSet } = OpenIDClient;
let axios = require("axios");
const { hentFraRedis, lagreIRedis } = require("../cache");

const tokenSetSelfId = "self";

const getOnBehalfOfAccessToken = async (authClient, req, api) => {
  console.log("inside getOnBehalfOfAccessToken");
  const kabalId = req.cookies.kabalId;
  console.log({ kabalId });
  const token = await hentFraRedis(kabalId);
  console.log(token);

  return new Promise((resolve, reject) => {
    if (hasValidAccessToken(req, api.clientId)) {
      const tokenSets = getTokenSetsFromSession(req);
      resolve(tokenSets[api.clientId].access_token);
    } else {
      const params = {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        requested_token_use: "on_behalf_of",
        scope: createOnBehalfOfScope(api),
        assertion: token || req.user.tokenSets[tokenSetSelfId].access_token,
      };
      console.log({ token, params });

      authClient
        .grant(params)
        .then((tokenSet) => {
          req.user.tokenSets[api.clientId] = tokenSet;
          resolve(tokenSet.access_token);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    }
  });
};

const getUserInfoFromGraphApi = (authClient, req) => {
  return new Promise((resolve, reject) => {
    const api = {
      scopes: ["https://graph.microsoft.com/.default"],
      clientId: "https://graph.microsoft.com",
    };
    const query =
      "onPremisesSamAccountName,displayName,givenName,mail,officeLocation,surname,userPrincipalName,id,jobTitle";
    const graphUrl = `https://graph.microsoft.com/v1.0/me?$select=${query}`;
    getOnBehalfOfAccessToken(authClient, req, api)
      .then((accessToken) =>
        axios.get(graphUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      )
      .then((response) => resolve(response.data))
      .catch((err) => {
        if (err.response.data) reject(err.response.data);
        else reject(err);
      });
  });
};

const appendDefaultScope = (scope) => `${scope}/.default`;

const formatClientIdScopeForV2Clients = (clientId) =>
  appendDefaultScope(`api://${clientId}`);

const createOnBehalfOfScope = (api) => {
  if (api.scopes && api.scopes.length > 0) {
    return `${api.scopes.join(" ")}`;
  } else {
    return `${formatClientIdScopeForV2Clients(api.clientId)}`;
  }
};

const getTokenSetsFromSession = (req) => {
  if (req && req.user) {
    return req.user.tokenSets;
  }
  return null;
};

const hasValidAccessToken = (req, key = tokenSetSelfId) => {
  const tokenSets = getTokenSetsFromSession(req);
  if (!tokenSets) {
    return false;
  }
  const tokenSet = tokenSets[key];
  if (!tokenSet) {
    return false;
  }
  return new TokenSet(tokenSet).expired() === false;
};

const refreshAccessToken = async (azureClient, session, kabalId) => {
  console.log("inside refreshAccessToken");
  const user = session.session.passport.user || session.user;
  const refreshToken = user.tokenSets.self.refresh_token;
  if (!refreshToken) {
    console.log("session.session", session.session);
    console.log("session.user", session.user);
    console.log(JSON.stringify(user));
  }
  if (!refreshToken) return false;
  return await azureClient
    .refresh(refreshToken)
    .then(async (tokenSet) => {
      console.log({ kabalId });
      await lagreIRedis(kabalId, tokenSet.access_token);
      console.log("expire", tokenSet.expires_at);
      return tokenSet;
    })
    .catch((errorMessage) => {
      console.error(
        `Feilet refresh av access token for ${JSON.stringify(
          session.session.user
        )}: ${errorMessage}`
      );
      return false;
    });
};

module.exports = {
  getOnBehalfOfAccessToken,
  getUserInfoFromGraphApi,
  appendDefaultScope,
  hasValidAccessToken,
  tokenSetSelfId,
  refreshAccessToken,
};
