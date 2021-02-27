export default function routes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.
    app.get('/', (req, res) => {
        res.redirect('/atlassian-connect.json');
    });

    // This is an example route used by "generalPages" module (see atlassian-connect.json).
    // Verify that the incoming request is authenticated with Atlassian Connect.
    app.get('/jari', addon.authenticate(), (req, res) => {
        // Rendering a template is easy; the render method takes two params: the name of the component or template file, and its props.
        // Handlebars and jsx are both supported, but please note that jsx changes require `npm run watch-jsx` in order to be picked up by the server.
        
        var httpClient = addon.httpClient(req);
        httpClient.get(
          {
              url: 'rest/api/3/search',
              qs: {
                jql: "project = Financial",
                maxResults: 100,
                fieldsByKeys: true,
                fields: [
                  // "*all",
                  "summary",
                  "created",
                  "customfield_10030"
                ],
                startAt: 0
              }
            }, function(err, apiRes, body) {

              const summary = {
                amount: 0
              }

              const items = JSON.parse(body).issues.map(i => {
                summary.amount += i.fields.customfield_10030;
                return {
                  summary: i.fields.summary,
                  created: i.fields.created,
                  amount: i.fields.customfield_10030
                }
              })

              console.log(items)
              res.render(
                'jari.hbs',
                {
                  items: items,
                  summary: summary
                }
              );
          });
    });

    // Add additional route handlers here...
}
