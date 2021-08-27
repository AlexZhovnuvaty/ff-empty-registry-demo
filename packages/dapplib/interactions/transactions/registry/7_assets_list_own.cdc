import RegistrySampleContract from Project.RegistrySampleContract

// Lists an NFT for sale

transaction() {

  let ehrCollection: &RegistrySampleContract.Collection

  prepare(acct: AuthAccount) {
      self.ehrCollection = acct.borrow<&RegistrySampleContract.Collection>(from: RegistrySampleContract.TenantStoragePath) 
          ?? panic("Could not borrow the user's EHR Collection")
  }

  execute {
      self.ehrCollection.getMetaData()

      log("Listed EHRs for user")
  }
}
