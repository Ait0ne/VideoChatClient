import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

import SignUpForm from '../../components/SignUpForm/signUpForm.component';
import SignInForm from '../../components/SignInForm/signInForm.component';
import backgroundImage from '../../assets/background.jpeg'
import {
    AuthPageContainer, 
    AuthMainContainer, 
} from './auth.styles';
import {CustomButton} from '../../styles/styles';
import {AuthMainVariants, SignInVariants} from '../../framer/variants';




const AuthPage: React.FC = () => {
    const [showSignIn, setShowSignIn] = useState(false)
    const [showSignUp, setShowSignUp] = useState(false)

    const toggleShowSignUp = () => {
        setShowSignUp(!showSignUp)
    }

    const toggleShowsignIn = () => {
        setShowSignIn(!showSignIn)
    }

    return (
        <AuthPageContainer>
            <AuthMainContainer 
            style={{backgroundImage: `url(${backgroundImage})`}}
            animate={showSignIn||showSignUp? 'hidden' : 'visible'}
            variants={AuthMainVariants}
            >
                <CustomButton 
                onClick={toggleShowsignIn}
                variants={SignInVariants}
                size='lg'
                >
                    Sign In
                </CustomButton>
                <motion.span
                variants={SignInVariants}
                >
                    Don't have an account yet? <span onClick={toggleShowSignUp}>Sign Up</span> 
                </motion.span>
            </AuthMainContainer>
            <AnimatePresence exitBeforeEnter>
            {
                showSignIn?
                    <SignInForm toggleShowSignIn={toggleShowsignIn}/>
                :null
            }
                        {
                showSignUp?
                    <SignUpForm toggleShowSignIn={toggleShowSignUp}/>
                :null
            }
            </AnimatePresence>
        </AuthPageContainer>
    )
}



export default AuthPage;