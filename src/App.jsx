import { useEffect, useState } from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import { generateClient } from 'aws-amplify/data';
import { Button, Divider, Flex, Grid, Heading, useAuthenticator, View } from '@aws-amplify/ui-react';

Amplify.configure(outputs);
const client = generateClient({
  authMode: 'userPool',
});

function App() {
  const [userProfiles, setUserProfiles] = useState([]);
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  async function fetchUserProfiles() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }

  return (
    <Flex
      className='App'
      justifyContent='center'
      alignItems='center'
      direction='column'
      width='70%'
      margin='0 auto'
    >
      <Heading level={1}>My Profile</Heading>
      <Divider />

      <Grid
      margin='3rem 0'
      autoFlow='column'
      justifyContent='center'
      gap='2rem'
      alignContent='center'
      >
        {userProfiles.map((profile) => (
          <Flex
          key={profile.id || profile.email}
          direction='column'
          justifyContent='center'
          alignItems='center'
          gap='2rem'
          border='1px solid #ccc'
          padding='2rem'
          borderRadius='5%'
          className='box'
          >
            <View>
              <Heading level='3'>{profile.email}</Heading>
            </View>
          </Flex>
        ))}
      </Grid>
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}

export default App;
