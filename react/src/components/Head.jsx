import { Helmet } from 'react-helmet-async';

export default function Head({ title, children }) {
  const appName = import.meta.env.VITE_APP_NAME || 'React';

  return (
    <Helmet>
      <title>{title ? `${title} | ${appName}` : appName}</title>
      {children}
    </Helmet>
  );
}
