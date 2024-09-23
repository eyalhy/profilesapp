import { Amplify } from 'aws-amplify';
import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { env } from '$amplify/env/postConfirmation';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../data/resource';
import { createUserProfile } from './graphql/mutations';

Amplify.configure({
    API: {
        GraphQL: {
            defaultAuthMode: 'iam',
            endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
            region: env.AWS_REGION
        }
    }
},
    {
        Auth: {
            credentialsProvider: {
                getCredentialsAndIdentityId: async () => ({
                    credentials: {
                        accessKeyId: env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
                        sessionToken: env.AWS_SESSION_TOKEN
                    }
                }),
                clearCredentialsAndIdentityId: () => {
                    // No implementation
                }
            }
        }
    });

const client = generateClient<Schema>({
    authMode: 'iam'
});

export const handler: PostConfirmationTriggerHandler = async (event) => {
    await client.graphql({
        query: createUserProfile,
        variables: {
            input: {
                email: event.request.userAttributes.email,
                profileOwner: `${event.request.userAttributes.sub}::${event.userName}`
            }
        }
    });

    return event;
}