/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react'
import { Theme } from '@/styles/theme'
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'

const containerStyles = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${theme.colors.background.main};
  font-family: ${theme.typography.fontFamily};
`

const titleStyles = (theme: Theme) => css`
  font-size: ${theme.typography.fontSize.xxxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
  text-align: center;
`

interface HomeProps {
  name: string;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  type Data = { name: string };

  const data = await import('../api/hello').then(mod => {
    const handler = mod.default;
    return new Promise<Data>((resolve) => {
      handler(
        { method: 'GET' } as NextApiRequest,
        { json: resolve, status: () => ({ json: resolve }) } as unknown as NextApiResponse
      );
    });
  });
  
  return {
    props: {
      name: data.name,
    },
  };
};

export default function Home({ name }: HomeProps) {
  const theme = useTheme() as Theme;
  
  return (
    <div css={containerStyles(theme)}>
      <h1 css={titleStyles(theme)}>Hello, {name}</h1>
    </div>
  );
}