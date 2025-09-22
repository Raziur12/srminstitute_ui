import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { GlobalStateProvider } from './states/GlobalState';
import './App.css';

// Pages Import
import AdminManagement from './component/AdminManagement/AdminManagement';
import Assign from './component/Assign/Assign';
import LearningPath from './component/LearningPath/LearningPath';
import Navbar from './component/Navbar/Navbar';
import Contact from './component/Pages/Contact';
import Feedback from './component/Pages/FeedBack';
import SideBar from './component/sidebar/SideBar';
import CreateAdmin from './component/AdminManagement/AdminProfile/CreateAdmin';
import AssignModal from './component/Assign/AssignModal/AssignModal';
import LoginPage from './component/login/LoginPage';
import AdminCreated from './component/AdminManagement/AdminProfile/AdminCreated';
import SignupPage from './component/Signup/Signup';
import ForgotNewPassword from './component/login/component/NewPasswordSet/NewPasswordSet';
import UserDashboard from './component/UserDashboard/UserDashboard';
import Organization from './component/Organization/Organization';
import Series from './component/Series/Series';
import Library from './component/Library/Library';
import Resource from './component/Resource/Resource';
import InsightsMain from './component/Insights/InsightsMain';
import User from './component/Users/User';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Upgrade from './component/CreateUser/Upgrade';
import MCQAssessment from './component/Library/SubMenus/MCQAssessment/MCQAssessment';
import Sceniro from './component/Library/SubMenus/Sceniro/Sceniro';
import Insights from './component/Insights/Insights';
import QuestionTable from './component/Library/SubMenus/MCQAssessment/Questions/QuestionTable';
import ForgotPassword from './component/login/component/ForgotPassword';
import TrustDataDownloadBtn from './component/Insights/TrustDataDownloadBtn';
import EmailVerify from './component/ForgotPassWord/EmailVerify';
import NewPassword from './component/ForgotPassWord/NewPassword';
import FacultyAssessmentMain from './component/FacultyAssessments/FacultyAssessmentMain';
import PrivateRoute from './PrivateRoute';
import FacultyFeedback from './component/FacultyFeedback/FacultyFeedback';
import FacultyFeedbackForm from './component/FacultyFeedback/FacultyFeedbackForm';
import AnswerPDFDownload from './component/Insights/AnswerPDFDownload';
import Programs from './component/Programs/Programs';
import PreviewSegment from './component/Library/SubMenus/MCQAssessment/PreviewQuestion/PreviewSegment/PreviewSegment';
import PreviewQuestion from './component/Library/SubMenus/MCQAssessment/PreviewQuestion/PreviewQuestion';
import FeedbackPreview from './component/FacultyFeedback/FeedbackPreview/FeedbackPreview';
import OptionsTable from './component/Library/SubMenus/MCQAssessment/Options/OptionsTable';
import QuestionPaperTable from './component/FacultyAssessments/Questions/QuestionPaperTable';
// import QuestionOptionsTable from './component/FacultyAssessments/QuestionOption/QuestionOptionsTable';
import PreviewQuestionPaper from './component/FacultyAssessments/PreviewQuestionPaper/PreviewQuestionPaper';
import SubjectPerfrence from './component/TimeTable/SubjectPerfrence';
import NewPaperCategory from './component/FacultyAssessments/NewApiAddQuestion/PaperCategory/NewPaperCategory';
import NewCategoryQuestion from './component/FacultyAssessments/NewApiAddQuestion/NewCategoryQuestion/NewCategoryQuestion';
import SubQuestions from './component/FacultyAssessments/NewApiAddQuestion/SubQuestions/SubQuestions';
import MCQQuestions from './component/FacultyAssessments/NewApiAddQuestion/MCQQuestions/MCQQuestions';
import PrivewQuestionPaper from './component/FacultyAssessments/QuestionPaper/PrivewQuestionPaper';
import AddOneQuestion from './component/FacultyAssessments/Questions/AddOneQuestion';
const useStorageHandler = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem('wasHidden', 'true');
      }
    };

    // Ensure session persists even after refresh
    sessionStorage.setItem('stayLoggedIn', 'true');

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};


const ConditionalNavbar = () => {
  const location = useLocation();
  const normalizedPathname = location.pathname.replace(/\/+$/, ''); // Remove trailing slashes
  const hiddenRoutes = ['/', '/signup', '/forgot', '/resetpasswordconfirm/'];
  const isNavbarHidden = hiddenRoutes.includes(location.pathname) || location.pathname.startsWith('/accounts/password-reset-confirm/');
  return !isNavbarHidden && <Navbar />;
};

const ConditionalSidebar = () => {
  const location = useLocation();
  const normalizedPathname = location.pathname.replace(/\/+$/, ''); // Remove trailing slashes
  const hiddenRoutes = ['/', '/signup', '/forgot', '/resetpasswordconfirm/'];
  const isSidebarHidden = hiddenRoutes.includes(location.pathname) || location.pathname.startsWith('/accounts/password-reset-confirm/');
  return !isSidebarHidden && <SideBar />;
};

function App() {
  useStorageHandler();

  return (
    <Router>
      <GlobalStateProvider>
        <ToastContainer />
        <div className="App">
          <div className="navbar-app-container">
            <ConditionalNavbar />
          </div>
          <div className="app-bottom-container">
            <div className="sidebar-app-container">
              <ConditionalSidebar />
            </div>
            <div className="main-content-container">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/forgot" element={<EmailVerify />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/resetpasswordconfirm/" element={<NewPassword />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/AdminManagement" element={<AdminManagement />} />
                  <Route path="/Admin/CreateAdmin" element={<CreateAdmin />} />
                  <Route path="/Admin/CreateAdmin/Admin" element={<AdminCreated />} />
                  <Route path="/Assign" element={<Assign />} />
                  <Route path="/upgrade" element={<Upgrade />} />
                  <Route path="/Assign/Modal" element={<AssignModal />} />
                  <Route path="/Insight" element={<InsightsMain />} />
                  <Route path="/report" element={<Insights />} />
                  <Route path="/LearningPath" element={<LearningPath />} />
                  <Route path="/Contact" element={<Contact />} />
                  <Route path="/Feedback" element={<Feedback />} />
                  <Route path="/Organization" element={<Organization />} />
                  <Route path="/Series" element={<Series />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/resource" element={<Resource />} />
                  <Route path="/user" element={<User />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/library/mcq" element={<MCQAssessment />} />
                  <Route path="/library/scenario" element={<Sceniro />} />
                  <Route path="/questiontable" element={<QuestionTable />} />
                  <Route path="/trust" element={<TrustDataDownloadBtn />} />
                  <Route path="/answer" element={<AnswerPDFDownload />} />
                  <Route path="/faculty" element={<FacultyAssessmentMain />} />
                  <Route path="facultyFeedback" element={<FacultyFeedback />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/preview-segment" element={<PreviewSegment />} />
                  <Route path ="/preview-question" element={<PreviewQuestion />} />
                   <Route path="/optionstable" element={<OptionsTable />} />

                  <Route path="/facultyPreview" element={<FeedbackPreview />} />
                  <Route path="/facultyForm" element={<FacultyFeedbackForm />} />
                
                
                <Route path="/QuestionPapertable" element={<QuestionPaperTable />} />
                {/* <Route path="/QuestionOptionsTable" element={<QuestionOptionsTable />} /> */}
                <Route path="/PreviewQuestionPaper" element={<PreviewQuestionPaper />} />
               
                <Route path="/subjectPerfrence" element={<SubjectPerfrence />} />
                
                <Route path="/paper-category/:id" element={<NewPaperCategory />} /> 
                <Route path="/new-category-question/:id" element={<NewCategoryQuestion />} />
                <Route path="/sub-questions/:id" element={<SubQuestions />} />
                <Route path="/mcq-options/:id" element={<MCQQuestions />} />

                <Route path="/preview-question-paper/:id" element={<PrivewQuestionPaper />} />
                <Route path="/add-one-question/:id" element={<AddOneQuestion />} />
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </GlobalStateProvider>
    </Router>
  );
}

export default App;
