import { SynapseConstants } from 'synapse-react-client'
import { HomeExploreConfig } from '../../types/portal-config'
import loadingScreen from '../loadingScreen'

const sql = 'SELECT grantType AS "Grant Type", centerName AS "Grant", consortium AS "Program", species AS "Species", fileFormat AS "Data Format", experimentalStrategy AS "Assay", platform AS "Platform", tumorType AS "Disease Type", sex AS "Gender", tissue AS "Tissue", name as "File Name"  FROM syn9630847'

const facetAliases = {
  grantType: 'Grant Type',
  centerName: 'Grant',
  consortium: 'Program',
  species: 'Species',
  fileFormat: 'Data Format',
  experimentalStrategy: 'Assay',
  platform: 'Platform',
  tumorType: 'Disease Type',
  sex: 'Gender',
  tissue: 'Tissue',
  name: 'File Name'
}

const rgbIndex = 6
const unitDescription = 'files'
const synapseId  = 'syn9630847'
const facetName = 'grantType'

export const files: HomeExploreConfig = {
  homePageSynapseObject: {
    name: 'QueryWrapperFlattened',
    props: {
      rgbIndex,
      facetName,
      unitDescription,
      loadingScreen,
      facetAliases: {
        grantType: 'Grant Type',
      },
      link: 'Explore/Files',
      linkText: 'Explore Files',
      initQueryRequest: {
        concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
        partMask: SynapseConstants.BUNDLE_MASK_QUERY_FACETS
          | SynapseConstants.BUNDLE_MASK_QUERY_RESULTS,
        query: {
          sql,
          isConsistent: false,
          limit: 25,
          offset: 0,
        }
      }
    }
  },
  explorePageSynapseObject: {
    name: 'QueryWrapperMenu',
    props: {
      rgbIndex,
      unitDescription,
      tableConfiguration: {
        synapseId,
        title: 'Files',
      },
      stackedBarChartConfiguration: {
        loadingScreen
      },
      name: 'Files',
      facetAliases,
      menuConfig: [
        {
          sql,
          facetName: 'grantType',
        },
        {
          sql,
          facetName: 'centerName',
        },
        {
          sql,
          facetName: 'consortium',
        },
        {
          sql,
          facetName: 'species',
        },
        {
          sql,
          facetName: 'Theme'
        },
        {
          sql,
          facetName: 'fileFormat',
        },
        {
          sql,
          facetName: 'experimentalStrategy',
        },
        {
          sql,
          facetName: 'platform',
        },
        {
          sql,
          facetName: 'tumorType',
        },
        {
          sql,
          facetName: 'sex',
        },
        {
          sql,
          facetName: 'tissue',
        },
      ]
    }
  }
}
