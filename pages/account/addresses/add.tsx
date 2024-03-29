import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useQuery } from '@graphcommerce/graphql'
import {
  ApolloCustomerErrorFullPage,
  CreateCustomerAddressForm,
  CustomerDocument,
} from '@graphcommerce/magento-customer'
import { AccountDashboardAddressesQuery } from '@graphcommerce/magento-customer-account'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  GetStaticProps,
  SectionContainer,
  iconAddresses,
  LayoutOverlayHeader,
  LayoutTitle,
} from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Container, NoSsr } from '@mui/material'
import { LayoutOverlay, LayoutOverlayProps } from '../../../components'
import { graphqlSharedClient } from '../../../lib/graphql/graphqlSsrClient'

type Props = AccountDashboardAddressesQuery
type GetPageStaticProps = GetStaticProps<LayoutOverlayProps, Props>

function AddNewAddressPage() {
  const { loading, error } = useQuery(CustomerDocument, { ssr: false })

  if (loading) return <div />
  if (error)
    return (
      <ApolloCustomerErrorFullPage
        error={error}
        signInHref='/account/signin'
        signUpHref='/account/signin'
      />
    )

  return (
    <>
      <LayoutOverlayHeader>
        <LayoutTitle size='small' component='span' icon={iconAddresses}>
          <Trans id='Addresses' />
        </LayoutTitle>
      </LayoutOverlayHeader>
      <Container maxWidth='md'>
        <PageMeta title={i18n._(/* i18n */ `Add address`)} metaRobots={['noindex']} />
        <NoSsr>
          <LayoutTitle icon={iconAddresses}>
            <Trans id='Addresses' />
          </LayoutTitle>
          <SectionContainer labelLeft={<Trans id='Add new address' />}>
            <CreateCustomerAddressForm />
          </SectionContainer>
        </NoSsr>
      </Container>
    </>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  overlayGroup: 'account',
  Layout: LayoutOverlay,
  sharedKey: () => 'account/addresses',
}
AddNewAddressPage.pageOptions = pageOptions

export default AddNewAddressPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })

  return {
    props: {
      apolloState: await conf.then(() => client.cache.extract()),
      variantMd: 'bottom',
      size: 'max',
      up: { href: '/account', title: 'Account' },
    },
  }
}
