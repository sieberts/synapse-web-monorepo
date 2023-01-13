import React, {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { SynapseClient } from 'synapse-react-client'
import { SynapseContextProvider } from 'synapse-react-client/dist/utils/SynapseContext'
import { UserProfile } from 'synapse-react-client/dist/utils/synapseTypes'
import useAnalytics from './useAnalytics'
import { getSearchParam } from 'URLUtils'
import { ThemeOptions } from '@mui/material'
import { getSourceAppTheme } from 'components/SourceApp'
import { Redirect, useLocation } from 'react-router-dom'

export type AppInitializerState = {
  token?: string
  showLoginDialog: boolean
  userProfile: UserProfile | undefined
  // delay render until get session is called, o.w. theres an uneccessary refresh right
  // after page load
  hasCalledGetSession: boolean
}

/**
 * State and helpers for managing a user session in the portal
 * @param setShowLoginDialog
 * @returns
 */
function useSession(
) {
  const [token, setToken] = useState<string | undefined>(undefined)
  const [touSigned, setTouSigned] = useState(true)
  const [hasCalledGetSession, setHasCalledGetSession] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(
    undefined,
  )
  const initAnonymousUserState = useCallback(() => {
    SynapseClient.signOut(() => {
      // reset token and user profile
      setToken(undefined)
      setUserProfile(undefined)
      setHasCalledGetSession(true)
    })
  }, [])

  const getSession = useCallback(async () => {
    let token
    try {
      token = await SynapseClient.getAccessTokenFromCookie()
      if (!token) {
        initAnonymousUserState()
        return
      }
    } catch (e) {
      console.error('Unable to get the access token: ', e)
      initAnonymousUserState()
      return
    }
    await setToken(token)
    await setHasCalledGetSession(true)
    try {
      // get user profile
      const userProfile = await SynapseClient.getUserProfile(token)
      if (userProfile.profilePicureFileHandleId) {
        userProfile.clientPreSignedURL = `https://www.synapse.org/Portal/filehandleassociation?associatedObjectId=${userProfile.ownerId}&associatedObjectType=UserProfileAttachment&fileHandleId=${userProfile.profilePicureFileHandleId}`
      }
      setUserProfile(userProfile)
    } catch (e) {
      console.error('Error on getSession: ', e)
      if (e.reason == "Terms of use have not been signed.") {
        setTouSigned(false)
      } else {
        // intentionally calling sign out because there token could be stale so we want
        // the stored session to be cleared out.
        SynapseClient.signOut(() => {
          // PORTALS-2293: if the token was invalid (caused an error), reload the app to ensure all children
          // are loading as the anonymous user
          window.location.reload()
        })
      }
    }
  }, [initAnonymousUserState])


  return {
    token,
    userProfile,
    hasCalledGetSession,
    getSession,
    touSigned
  }
}

function AppInitializer(props: { children?: React.ReactNode }) {
  const [isFramed, setIsFramed] = useState(false)
  const [appId, setAppId] = useState<string>()
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>()
  const { token, getSession, hasCalledGetSession, touSigned } =
    useSession()

  useEffect(() => {
    // SWC-6294: on mount, detect and attempt a client-side framebuster (mitigation only, easily bypassed by attacker)
    if (window.top && window.top !== window) {
      // If not sandboxed, make sure not to show any portal content (in case they block window unload via onbeforeunload)
      setIsFramed(true)
      // If sandboxed, this call will cause an uncaught js exception and portal will not load.
      window.top.location = window.location
    }
  }, [])

  useEffect(() => {
    const searchParamAppId = getSearchParam('appId')
    const localStorageAppId = localStorage.getItem('sourceAppId')
    if (searchParamAppId) {
      localStorage.setItem('sourceAppId', searchParamAppId)
      setAppId(searchParamAppId)
    } else if (localStorageAppId) {
      setAppId(localStorageAppId)
    }
  }, [])

  useEffect(() => {
    if (appId) {
      setThemeOptions(getSourceAppTheme())
    }
  }, [appId])

  /** Call getSession on mount */
  useEffect(() => {
    getSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useAnalytics()

  useEffect(() => {
    // on first time, also check for the SSO code
    SynapseClient.detectSSOCode()
  }, [])


  if (!hasCalledGetSession) {
    // Don't render anything until the session has been established
    // Otherwise we may end up reloading components and making duplicate requests
    return <></>
  }
  const location = useLocation()
  return (
    <SynapseContextProvider
      synapseContext={{
        accessToken: token,
        isInExperimentalMode: SynapseClient.isInSynapseExperimentalMode(),
        utcTime: SynapseClient.getUseUtcTimeFromCookie(),
        downloadCartPageUrl: '',

      }} theme={themeOptions}
    >
      {!touSigned && location.pathname != '/authenticated/signTermsOfUse' && <Redirect to='/authenticated/signTermsOfUse' />}
      {!isFramed && props.children}
    </SynapseContextProvider>
  )
}

export default AppInitializer
