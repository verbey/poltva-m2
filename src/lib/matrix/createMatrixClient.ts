import { createClient, MatrixClient, ICreateClientOpts } from "matrix-js-sdk";

function createMatrixClient(config: ICreateClientOpts): MatrixClient {
  const clientOptions: ICreateClientOpts = {
    baseUrl: config.baseUrl,
    timelineSupport: true,
  };

  const client = createClient(clientOptions);

  return client;
}

export default createMatrixClient;
