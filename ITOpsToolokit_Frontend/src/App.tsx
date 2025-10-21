import { Routes, Route } from 'react-router-dom'
import CloudAdvisoryPage from './features/Components/AdvisoryAging/AdvisoryAging'
import AdvisoryAgingTable from './features/Components/AdvisoryAgingTable/AdvisoryAgingTable'
import AgingTable from './features/Components/AgingTable/AgingTable'
import CloudAdvisoryTable from './features/Components/CloudAdvisoryTable/CloudAdvisoryTable'
import Cloudtable from './features/Components/Cloudtable/Cloudtable'
import DynamicForms from './features/Components/DynamicForms/DynamicForms'
import LaunchStackDetails from './features/Components/LaunchStackDetails/LaunchStackDetails'
import Layout from './features/Components/Layout/Layout'
import LoginPage from './features/Components/LoginPage/LoginPage'
import ManageTaggingPolicy from './features/Components/ManageTaggingPolicy/ManageTaggingPolicy'
import OrphanAgingTable from './features/Components/OrphanAgingTable/OrphanAgingTable'
import OrphanPage from './features/Components/OrphanPage/OrphanPage'
import OrphanTable from './features/Components/OrphanTable/OrphanTable'
import ProjectForm from './features/Components/ProjectOnBoarding/ProjectForm'
import RoleForm from './features/Components/RolesOnBoarding/RoleForm'
import StackOnoarding from './features/Components/StackOnboaring/StackOnoarding'
import SubscriptionForm from './features/Components/SubscriptionOnBoarding/SubscriptionForm'
import TaggingPage from './features/Components/TaggingPage/TaggingPage'
import UserForm from './features/Components/UserOnBoarding/UserForm'
import VmWarePage from './features/Components/VmWarePage/VmWarePage'

const App = () => {
  return (
    <>
    <div className="Itsm_bg_image">
      <Layout />
    </div>
    </>
  )
}

export default App
