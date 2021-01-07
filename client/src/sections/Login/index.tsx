import React, { useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Card, Layout, Spin, Typography } from 'antd';
import { AUTH_URL } from '../../lib/graphql/queries';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';

import { LOG_IN } from '../../lib/graphql/mutations';
import {
  LogIn as LogInData,
  LogInVariables,
} from '../../lib/graphql/mutations/Login/__generated__/LogIn';
import { displaySuccessNotification, displayErrorMessage } from '../../lib/utils';
import { ErrorBanner } from '../../lib/components/index';

import { Viewer } from '../../lib/types';
// Image Assets
import googleLogo from './assets/google_logo.jpg';
import airLogo from './assets/logo.png';

const { Content } = Layout;
const { Text, Title } = Typography;
interface Props {
  setViewer: (viewer: Viewer) => void;
}
export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      console.log(data);
      if (data && data.logIn) {
        setViewer(data.logIn);
        displaySuccessNotification("You've successfully logged in!");
      }
    },
  });
  // useRef persist for th lifetime of the component
  const logInRef = useRef(logIn);
  /*
render logIn on compoenent render and if code avaialable 
no dependency as component not to run after mounter
*/
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      // useRef.current = > is the LogIn object from logInRef
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!"
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className='log-in'>
        <Spin size='large' tip='Logging you in...' />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null;
  return (
    <Content className='log-in'>
      {logInErrorBannerElement}
      <Card className='log-in-card'>
        <div className='log-in-card__intro'>
          <Title level={3} className='log-in-card__intro-title'>
            <span role='img' aria-label='wave'>
              <img
                src={airLogo}
                alt='AirHouse Logo'
                className='log-in-card__google-button-logo'
              />
            </span>
          </Title>
          <Title level={3} className='log-in-card__intro-title'>
            Log in to AirHouse!
          </Title>
          <Text>Sign in with Google to start booking available for rentals!</Text>
        </div>
        <button className='log-in-card__google-button' onClick={handleAuthorize}>
          <img
            src={googleLogo}
            alt='Google Logo'
            className='log-in-card__google-button-logo'
          />
          <span className='log-in-card__google-button-text'>Sign in with Google</span>
        </button>
        <Text type='secondary'>
          Note: By signing in, you'll be redirected to the Google consent form to sign in
          with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
