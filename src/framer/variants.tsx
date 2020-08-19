export const AuthMainVariants = {
    visible: {
        clipPath:'circle(140vh at 50% 0%)',
        filter: 'brightness(100%)',
        transition: {
            duration: 1.1,
            delay: 0.1
          }
    },
    hidden: {
        clipPath: 'circle(55vh at 50% 0%)',
        filter: 'brightness(80%)',
        transition: {
            duration: 0.8
          }
    }

}

export const SignInVariants = {
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
          }
    },
    hidden: {
        y: -150,
        opacity: 0,
        transition: {
            duration: 0.8,
          }
    }
}