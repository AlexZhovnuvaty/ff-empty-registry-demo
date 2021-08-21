import NonFungibleToken from Flow.NonFungibleToken
import RegistrySampleContract from Project.RegistrySampleContract

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has a minter resource. In this case,
// we are calling the transaction with the Tenant itself because it stores
// an NFTMinter resource in the Tenant resource

transaction(ehr_hash: String) {
    
    // the tenant
    let tenant: &RegistrySampleContract.Tenant
    let receiver: &RegistrySampleContract.Collection{RegistrySampleContract.INFTCollectionReporter}

    prepare(acct: AuthAccount) {

        self.tenant = acct.borrow<&RegistrySampleContract.Tenant>(from: RegistrySampleContract.TenantStoragePath)
                        ?? panic("Could not borrow the Tenant")
         // borrow the recipient's public NFT collection reference
        self.receiver = acct.getCapability(/private/NFTCollection)
            .borrow<&RegistrySampleContract.Collection{RegistrySampleContract.INFTCollectionReporter}>()
            ?? panic("Could not get receiver reference to the EHR hash Collection")
        
    }

    execute {
        // get a reference to an NFTMinter resource from the Tenant
        let reporter = self.tenant.reporterRef()

        // mint the NFT and deposit it to the recipient's collection
        reporter.addEHR(tenant: self.tenant, recipient: self.receiver, ehr_hash: ehr_hash)
    }
}