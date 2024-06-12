type Metadata = {
    title: string;
    description: string;
    keywords: string;
    openGraph: {
        url: string;
    }
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function getMetadata({ dictionary, path }: { dictionary: Record<string, string>, path: string }): Metadata {
    return {
        title: dictionary?.title || '',
        description: dictionary?.description || '',
        keywords: dictionary?.keywords || '',
        openGraph: {
            url: `${appUrl}/${path}`
        }
    }
}