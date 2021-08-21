import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('sample-harness')
export default class SampleHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body title="${this.title}" category="${this.category}" description="${this.description}">
      
        <!-- Registry -->
      
        <action-card title="1. Registry - Get Auth NFT"
          description="Register a Tenant with the RegistryService to get an AuthNFT" action="receiveAuthNFT" method="post"
          fields="signer">
          <account-widget field="signer" label="Account">
          </account-widget>
        </action-card>
      
        <action-card title="Registry - Has Auth NFT" description="Checks to see if an account has an AuthNFT"
          action="hasAuthNFT" method="get" fields="tenant">
          <account-widget field="tenant" label="Tenant Account">
          </account-widget>
        </action-card>
      
        <action-card title="2. RegistrySampleContract - Get Tenant"
          description="Get an instance of a Tenant from RegistrySampleContract to have your own data" action="receiveTenant"
          method="post" fields="signer">
          <account-widget field="signer" label="Account">
          </account-widget>
        </action-card>
      
        <!-- Flow Token -->
        <action-card title="Get Balance" description="Get the Flow Token balance of an account" action="getBalance"
          method="get" fields="account">
          <account-widget field="account" label="Account">
          </account-widget>
        </action-card>

        <action-card title="3. RegistrySampleContract - Provision Account" description="Set up an account to have a Collection"
          action="provisionAccountEHR" method="post" fields="acct">
          <account-widget field="acct" label="Account">
          </account-widget>
        </action-card>

        <action-card title="4. RegistrySampleContract - Add EHR hash"
          description="Add EHR hash to your own data" action="insertEHRHash"
          method="post" fields="signer ehr_hash">
          <account-widget field="signer" label="Account">
          </account-widget>
          <text-widget field="ehr_hash" label="EHR hash" placeholder="0x111222333"></text-widget>
        </action-card>
      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
