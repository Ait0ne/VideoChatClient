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
import {SignInVariants} from '../../framer/variants';
import {useWindowDimensions} from '../../hooks/useWindowDimensions.hook';

export const AuthMainVariants = {
    visible: (height:number) => ({
        clipPath: `circle(${0.7*height}px at 50% 50%)`,
        filter: 'brightness(100%)',
        transition: {
            duration: 1.1,
            delay: 0.1
          }
    }),
    hidden: (height:number) => ({
        clipPath: `circle(${0.55*height}px at 50% 0%)`,
        filter: 'brightness(80%)',
        transition: {
            duration: 0.8
          }
    })

}

const AuthPage: React.FC = () => {
    const [showSignIn, setShowSignIn] = useState(false)
    const [showSignUp, setShowSignUp] = useState(false)
    const {height} = useWindowDimensions()

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
            custom={height}
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
                    <SignInForm height={height} toggleShowSignIn={toggleShowsignIn}/>
                :null
            }
                        {
                showSignUp?
                    <SignUpForm height={height} toggleShowSignIn={toggleShowSignUp}/>
                :null
            }
            </AnimatePresence>
        </AuthPageContainer>
    )
}



export default AuthPage;