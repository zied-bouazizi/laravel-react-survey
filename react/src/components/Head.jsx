import { Helmet } from 'react-helmet-async';

export default function Head({ title, description, children }) {
  const appName = import.meta.env.VITE_APP_NAME || 'React';

  return (
    <Helmet>
      <title>{title ? `${title} | ${appName}` : appName}</title>
      {description && <meta name="description" content={description} />}
      {children}
    </Helmet>
  );
}
