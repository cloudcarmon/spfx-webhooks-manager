import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  IPropertyPaneField
} from '@microsoft/sp-webpart-base';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import SpWebHooksManager from './components/SpWebHooksManager';
import { ISpWebHooksManagerProps } from './components/ISpWebHooksManagerProps';
import { sp } from '@pnp/sp';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import startCase from 'lodash.startcase';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

export interface ISpWebHooksManagerWebPartProps {
  showAdminButtons: boolean;
  listTemplateTypes: string[];
  title: string;
  queryType: QueryType;
  lists: string[];
}

export enum QueryType {
  TEMPLATE = "template",
  LIST = "list"
}

export default class SpWebHooksManagerWebPart extends BaseClientSideWebPart<ISpWebHooksManagerWebPartProps> {
  private templateTypes: IPropertyPaneDropdownOption[];

  public render(): void {
    const element: React.ReactElement<ISpWebHooksManagerProps> = React.createElement(
      SpWebHooksManager,
      {
        showAdminButtons: this.properties.showAdminButtons,
        listTemplateTypes: this.properties.listTemplateTypes,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        title: this.properties.title,
        queryType: this.properties.queryType,
        lists: this.properties.lists
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected onInit(): Promise<void> {
    this.templateTypes = Object.keys(SP.ListTemplateType)
      .filter(key => !isNaN(parseInt(SP.ListTemplateType[key])))
      .map((e) => {
        return {
          key: e,
          text: startCase(e)
        };
      });

    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    let {
      queryType,
      lists,
      listTemplateTypes,
    } = this.properties;

    let queryGroup: IPropertyPaneField<any>[] = [
      PropertyPaneDropdown('queryType', {
        label: "Select query type",
        options: [
          {
            key: "list",
            text: "List"
          },
          {
            key: "template",
            text: "Template"
          }
        ]
      })
    ];

    if (queryType == QueryType.LIST) {
      queryGroup.push(
        PropertyFieldListPicker('lists', {
          label: 'Select a list',
          selectedList: lists,
          includeHidden: false,
          orderBy: PropertyFieldListPickerOrderBy.Title,
          disabled: false,
          onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
          properties: this.properties,
          context: this.context,
          onGetErrorMessage: null,
          key: 'listPicker',
          multiSelect: true
        })
      );
    } else if (queryType == QueryType.TEMPLATE) {
      queryGroup.push(
        PropertyFieldMultiSelect('listTemplateTypes', {
          key: 'listTemplateTypes',
          label: "List Template Types",
          options: this.templateTypes,
          selectedKeys: listTemplateTypes
        })
      );
    }

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: queryGroup
            },
            {
              groupName: "Styling",
              groupFields: [
                PropertyPaneCheckbox('showAdminButtons', {
                  text: "Show Admin Buttons?"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
