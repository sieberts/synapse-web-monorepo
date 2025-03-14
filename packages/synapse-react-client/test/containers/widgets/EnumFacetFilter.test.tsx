import React from 'react'
import {
  EnumFacetFilter,
  EnumFacetFilterProps,
} from '../../../src/components/widgets/query-filter/EnumFacetFilter'
import {
  ColumnModel,
  ColumnTypeEnum,
  FacetColumnResultValueCount,
} from '@sage-bionetworks/synapse-types'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SynapseConstants } from '../../../src/utils'
import { SynapseTestContext } from '../../../src/mocks/MockSynapseContext'
import { QueryVisualizationContextProvider } from '../../../src/components/QueryVisualizationWrapper'
import { QueryContextProvider } from '../../../src'
import userEvent from '@testing-library/user-event'

jest.mock('../../../src/synapse-client', () => {
  return {
    getGroupHeadersBatch: jest.fn().mockResolvedValue({
      children: [
        { ownerId: '123', userName: 'somename', isIndividual: false },
        { ownerId: '1234', userName: 'somename2', isIndividual: true },
      ],
    }),
    getEntityHeaders: jest.fn().mockResolvedValue({
      results: [
        { id: '123', name: 'Entity1' },
        { id: '1234', name: 'Entity2' },
      ],
    }),
  }
})

const mockAddValueToSelectedFacet = jest.fn()
const mockRemoveValueFromSelectedFacet = jest.fn()
const mockRemoveSelectedFacet = jest.fn()

const stringFacetValues: FacetColumnResultValueCount[] = [
  { value: 'Honda', count: 2, isSelected: false },
  { value: 'Chevy', count: 1, isSelected: true },
  {
    value: SynapseConstants.VALUE_NOT_SET,
    count: 1,
    isSelected: false,
  },
]

const userEntityFacetValues: FacetColumnResultValueCount[] = [
  {
    value: SynapseConstants.VALUE_NOT_SET,
    count: 2,
    isSelected: false,
  },
  { value: '123', count: 1, isSelected: false },
  { value: '1234', count: 1, isSelected: false },
]

const columnModel: ColumnModel = {
  columnType: ColumnTypeEnum.STRING,
  facetType: 'enumeration',
  id: '86423',
  name: 'Make',
}

function generateManyFacetColumnResultValueCounts(): FacetColumnResultValueCount[] {
  const result: FacetColumnResultValueCount[] = []
  // create random facet values with 6th item having largest count
  //and have an item with count = 1
  for (let i = 0; i < 20; i++) {
    result.push({
      value: `Honda${i}`,
      count: i === 5 ? 12 : i === 6 ? 1 : Math.floor(Math.random() * 10),
      isSelected: false,
    })
  }
  return result
}

function createTestProps(
  overrides?: Partial<EnumFacetFilterProps>,
): EnumFacetFilterProps {
  return {
    facetValues: stringFacetValues,
    columnModel: columnModel,
    ...overrides,
    containerAs: 'Collapsible',
  }
}

let container: HTMLElement
let props: EnumFacetFilterProps

function init(overrides?: Partial<EnumFacetFilterProps>) {
  props = createTestProps(overrides)
  container = render(
    <SynapseTestContext>
      <QueryContextProvider
        queryContext={{
          nextQueryRequest: {
            entityId: 'syn21450294',
            query: {
              sql: 'select * from syn21450294',
              selectedFacets: [
                {
                  columnName: 'Make',
                  facetValues: ['Chevy'],
                  concreteType:
                    'org.sagebionetworks.repo.model.table.FacetColumnValuesRequest',
                },
              ],
            },
            partMask: 0xffff,
            concreteType:
              'org.sagebionetworks.repo.model.table.QueryBundleRequest',
          },
          addValueToSelectedFacet: mockAddValueToSelectedFacet,
          removeValueFromSelectedFacet: mockRemoveValueFromSelectedFacet,
          removeSelectedFacet: mockRemoveSelectedFacet,
        }}
      >
        <QueryVisualizationContextProvider
          queryVisualizationContext={{
            getColumnDisplayName: jest.fn(col => col),
          }}
        >
          <EnumFacetFilter {...props} />
        </QueryVisualizationContextProvider>
      </QueryContextProvider>
    </SynapseTestContext>,
  ).container
}

describe('EnumFacetFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    init()
  })

  describe('initialization', () => {
    it('should render as a dropdown if containerAs = Dropdown', async () => {
      act(() =>
        init({
          containerAs: 'Dropdown',
        }),
      )
      expect(container.querySelector('.dropdown')).toBeDefined()
    })
    it('should render as a dropdown if containerAs = Collapsible', async () => {
      act(() =>
        init({
          containerAs: 'Collapsible',
        }),
      )
      expect(container.querySelector('div.FacetFilterHeader')).toBeDefined()
    })

    it('should initiate selected items correctly', async () => {
      const checkboxes = (await screen.findAllByRole(
        'checkbox',
      )) as HTMLInputElement[]
      expect(checkboxes).toHaveLength(4)

      expect(checkboxes).toHaveLength(4)
      checkboxes.forEach((checkbox, i) => {
        if (i === 2) {
          expect(checkbox.checked).toBe(true)
        } else {
          expect(checkbox.checked).toBe(false)
        }
      })
    })

    describe('collapsible behavior', () => {
      it('should hide content when toggled', async () => {
        init({ ...props, collapsed: false })
        expect(
          container.getElementsByClassName('EnumFacetFilter')[0],
        ).toHaveClass('MuiCollapse-entered')

        // toggle collapse via button
        const button = container.querySelector(
          'button.FacetFilterHeader__collapseToggleBtn',
        )
        fireEvent.click(button)

        await waitFor(() =>
          expect(
            container.getElementsByClassName('EnumFacetFilter')[0],
          ).toHaveClass('MuiCollapse-hidden'),
        )
      })

      it('should start collapsed when specified via prop', async () => {
        init({ ...props, collapsed: true })
        expect(
          container.getElementsByClassName('EnumFacetFilter')[0],
        ).toHaveClass('MuiCollapse-hidden')

        // toggle collapse via button
        const button = container.querySelector(
          'button.FacetFilterHeader__collapseToggleBtn',
        )
        fireEvent.click(button)

        await waitFor(() =>
          expect(
            container.getElementsByClassName('EnumFacetFilter')[0],
          ).toHaveClass('MuiCollapse-entered'),
        )
      })
    })

    describe('label initialization', () => {
      it('should set labels correctly for STRING type', () => {
        const labels = container.querySelectorAll<HTMLSpanElement>(
          'input[type="checkbox"] ~ label',
        )
        const counts = container.querySelectorAll<HTMLDivElement>(
          '.EnumFacetFilter__count',
        )
        expect(labels).toHaveLength(4)
        expect(counts).toHaveLength(3)

        expect(labels[0].textContent).toBe('All')

        expect(labels[1].textContent).toBe(`${stringFacetValues[0].value}`)
        expect(counts[0].textContent).toBe(`${stringFacetValues[0].count}`)

        expect(labels[2].textContent).toBe(`${stringFacetValues[1].value}`)
        expect(counts[1].textContent).toBe(`${stringFacetValues[1].count}`)

        expect(labels[3].textContent).toBe(`Not Assigned`)
        expect(counts[2].textContent).toBe(`${stringFacetValues[2].count}`)
      })

      it('should hide > 5 items if items with index >=5 not selected', async () => {
        const facetValues = generateManyFacetColumnResultValueCounts()

        init({
          ...props,
          facetValues,
        })

        const labels = container.querySelectorAll<HTMLDivElement>(
          '.EnumFacetFilter__count',
        )
        expect(labels).toHaveLength(5)
        expect(labels.item(0).textContent).toContain('12')
      })

      it('should show all items if items with index >=5 is selected', async () => {
        const facetValues = generateManyFacetColumnResultValueCounts()
        facetValues.find(item => item.count === 1)!.isSelected = true

        init({
          ...props,
          facetValues,
        })

        const labels = container.querySelectorAll(
          'input[type="checkbox"] ~ label',
        )
        expect(labels).toHaveLength(facetValues.length + 1)
      })

      it('should set labels correctly for ENTITYID type', async () => {
        const entityColumnModel: ColumnModel = {
          ...columnModel,
          columnType: ColumnTypeEnum.ENTITYID,
          name: 'File',
        }

        const updatedProps = {
          ...props,
          facetValues: userEntityFacetValues,
          columnModel: entityColumnModel,
        }

        act(() => init(updatedProps))
        const labels = container.querySelectorAll<HTMLInputElement>(
          'input[type="checkbox"] ~ label',
        )
        const counts = container.querySelectorAll<HTMLDivElement>(
          '.EnumFacetFilter__count',
        )
        expect(labels.item(1).textContent).toBe(`Not Assigned`)
        expect(counts.item(0).textContent).toBe(
          `${userEntityFacetValues[0].count}`,
        )

        // Wait for the entity info to populate and replace the ID
        await waitFor(() => expect(labels.item(2).textContent).toBe(`Entity1`))
        expect(counts.item(1).textContent).toBe(
          `${userEntityFacetValues[1].count}`,
        )

        await waitFor(() => expect(labels.item(3).textContent).toBe(`Entity2`))
        expect(counts.item(2).textContent).toBe(
          `${userEntityFacetValues[2].count}`,
        )
      })

      it('should set labels correctly for USERID type', async () => {
        const userColumnModel: ColumnModel = {
          ...columnModel,
          columnType: ColumnTypeEnum.USERID,
          name: 'Users',
        }

        const updatedProps = {
          ...props,
          facetValues: userEntityFacetValues,
          columnModel: userColumnModel,
        }

        act(() => init(updatedProps))
        const labels = container.querySelectorAll<HTMLSpanElement>(
          'input[type="checkbox"] ~ label',
        )
        const counts = container.querySelectorAll<HTMLDivElement>(
          '.EnumFacetFilter__count',
        )
        expect(labels).toHaveLength(4)
        // First item (0) is select all

        expect(labels.item(1).textContent).toBe(`Not Assigned`)
        expect(counts.item(0).textContent).toBe(
          `${userEntityFacetValues[0].count}`,
        )

        // Wait for the user info to populate and replace the ID
        await waitFor(() => expect(labels.item(2).textContent).toBe(`somename`))
        expect(counts.item(1).textContent).toBe(
          `${userEntityFacetValues[1].count}`,
        )

        await waitFor(() =>
          expect(labels.item(3).textContent).toBe(`somename2`),
        )
        expect(counts.item(2).textContent).toBe(
          `${userEntityFacetValues[2].count}`,
        )
      })
    })
  })

  describe('callbacks', () => {
    it('should call addValueToSelectedFacet with debounce option', async () => {
      const individualFacetCheckboxes = screen.getAllByRole('checkbox').slice(1)

      await userEvent.click(individualFacetCheckboxes[0])
      await userEvent.click(individualFacetCheckboxes[1])
      expect(mockAddValueToSelectedFacet).toHaveBeenCalledTimes(1)
      expect(mockAddValueToSelectedFacet).toHaveBeenCalledWith(
        'Make',
        stringFacetValues[0].value,
        { debounce: true },
      )
      expect(mockRemoveValueFromSelectedFacet).toHaveBeenCalledTimes(1)
      expect(mockRemoveValueFromSelectedFacet).toHaveBeenCalledWith(
        'Make',
        stringFacetValues[1].value,
        { debounce: true },
      )
    })

    it('should trigger callback on clear', async () => {
      const selectAllCheckbox = screen.getByLabelText('All')
      await userEvent.click(selectAllCheckbox)
      expect(mockRemoveSelectedFacet).toHaveBeenCalledWith(
        expect.objectContaining({
          columnName: columnModel.name,
        }),
      )
    })
  })
})
