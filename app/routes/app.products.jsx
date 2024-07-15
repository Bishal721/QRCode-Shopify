import {
  Box,
  Card,
  Layout,
  List,
  Page,
  Grid,
  Text,
  Thumbnail,
  Image,
  Button,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

import { getTopFiveQRCodes } from "../models/QRCode.server";
import { ImageIcon } from "@shopify/polaris-icons";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const qrCodes = await getTopFiveQRCodes(session.shop, admin.graphql);

  return json({
    qrCodes,
  });
}

export default function ProductsPage() {
  const { qrCodes } = useLoaderData();
  const navigate = useNavigate();
  return (
    <Page fullWidth>
      <TitleBar title="Top Selling Products" />
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {qrCodes.length === 0 ? (
              "Some thing went wrong"
            ) : (
              <Page fullWidth>
                <Grid>
                  {qrCodes.map((qrCode)=>(
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }} key={qrCode.id}>
                    <Card>
                      <Image
                        source={
                          qrCode.productImage || ImageIcon
                        }
                        alt={"Black choker necklace"}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <BlockStack gap="300">
                        <Text as="h2" variant="headingLg" alignment="center">
                          {qrCode.title}
                        </Text>
                        <Text as="h2" variant="bodyLg" alignment="start">
                          Products Scanned : {qrCode.scans}
                        </Text>
                        <Button
                          size="large"
                          variant="primary"
                          onClick={() => navigate(`/app/qrcodes/${qrCode.id}`)}
                        >
                          View Product
                        </Button>
                      </BlockStack>
                    </Card>
                  </Grid.Cell>
                  ))}
                  
                </Grid>
              </Page>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
