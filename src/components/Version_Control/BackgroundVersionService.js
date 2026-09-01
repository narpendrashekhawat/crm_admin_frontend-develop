// services/BackgroundVersionService.js
import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '../Context/authContext';
import { useToast } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Config } from '../Utils/Config';

const BackgroundVersionService = () => {
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);
  const toast = useToast();
  const { authToken } = useAuth();
  const channelRef = useRef(null);
  const hasCheckedRef = useRef(false);
  const location = useLocation();

  // Constants
  const CURRENT_VERSION_KEY = 'app_current_version';
  // const API_BASE = ('$Config?.Version_Control'); 

  // Console logging helper
  const log = useCallback((msg, level = 'info', data) => {
    const styles = {
      info: 'color:#2563EB; font-weight:bold',
      success: 'color:#16A34A; font-weight:bold',
      warn: 'color:#EA580C; font-weight:bold',
      error: 'color:#DC2626; font-weight:bold',
    };
    console.log(`%c[Background Version Service] ${msg}`, styles[level] || styles.info, data || '');
  }, []);


  // Get current version from localStorage
  const getCurrentVersion = useCallback(() => {
    try {
      const item = localStorage.getItem(CURRENT_VERSION_KEY);
      return item ? JSON.parse(item).version : null;
    } catch {
      return null;
    }
  }, []);

  // Set current version in localStorage
  const setCurrentVersionLS = useCallback((version) => {
    localStorage.setItem(
      CURRENT_VERSION_KEY,
      JSON.stringify({ version, ts: Date.now() })
    );
  }, []);

  // Hard reload function with 1s notice delay
  const hardReload = useCallback(async (fromVersion, toVersion) => {
    log(`🔄 VERSION CHANGE DETECTED: ${fromVersion} → ${toVersion}`, 'warn');
    setShowUpdateNotice(true); // Show notice UI

    // Wait 1 second before clearing cache and reloading
    setTimeout(async () => {
      setCurrentVersionLS(toVersion);

      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
          log('✅ Browser caches cleared', 'success');
        } catch (error) {
          log('⚠️ Failed to clear caches', 'warn', error);
        }
      }

      // Preserving sessionStorage; don't clear it here
      log('✅ Skipped clearing session storage (preserved)', 'info');

      if (channelRef.current) {
        channelRef.current.postMessage({
          type: 'RELOAD',
          newVersion: toVersion,
          timestamp: Date.now(),
        });
        log('📡 Notified other tabs about version update', 'info');
      }

      log('🔃 Reloading page...', 'info');
      window.location.reload();
    }, 1000); // 1 second delay
  }, [setCurrentVersionLS, log]);

  // Version check function, called on route change as well
  const checkVersions = useCallback(async () => {
    if (!authToken) {
      log('No auth token available, skipping version check', 'warn');
      return;
    }

    // Reset the check flag on route change to allow repeated checks
    hasCheckedRef.current = false;

    // Prevent multiple concurrent checks
    if (hasCheckedRef.current) {
      log('Version already checked this session, skipping', 'info');
      return;
    }

    log('🔍 Starting background version check...', 'info');

    try {
      let currentVersion = getCurrentVersion();
      if (!currentVersion) {
        currentVersion = '1.0.0';
        setCurrentVersionLS(currentVersion);
        log(`Initialized current version to ${currentVersion}`, 'info');
      } else {
        log(`Current version: ${currentVersion}`, 'info');
      }

      const response = await fetch(`${Config?.Version_Control}/latest-version`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const latestVersion = data?.data?.version_no;

      if (!latestVersion) {
        throw new Error('No version number in API response');
      }

      log(`Latest version from API: ${latestVersion}`, 'info');

      if (currentVersion !== latestVersion) {
        toast({
          title: 'Updating to latest version',
          description: 'A new version is here! The page will reload shortly…',
          status: 'info',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
        await hardReload(currentVersion, latestVersion);
      } else {
        log('Already on latest version - no update needed', 'success');
      }

      hasCheckedRef.current = true;
      log('Background version check completed', 'success');
    } catch (error) {
      const errorMsg = error?.message || 'Unknown error occurred';
      log(`Version check failed: ${errorMsg}`, 'error');
      hasCheckedRef.current = true;
    }
  }, [authToken, getCurrentVersion, setCurrentVersionLS, hardReload, log, toast]);

  // Setup BroadcastChannel for cross-tab reload sync
  useEffect(() => {
    channelRef.current = new BroadcastChannel('version-checker-bg');
    log('📡 BroadcastChannel initialized', 'info');

    channelRef.current.onmessage = (event) => {
      if (event.data?.type === 'RELOAD' && event.data?.newVersion) {
        const currentVersion = getCurrentVersion();
        if (currentVersion !== event.data.newVersion) {
          log(
            `Reload message received from another tab (v${event.data.newVersion}) and version differs, reloading.`,
            'info'
          );
          hardReload(currentVersion, event.data.newVersion);
        } else {
          log(
            `Reload message received from another tab (v${event.data.newVersion}) for updating version`,
            'info'
          );
        }
      }
    };

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
        log('📡 BroadcastChannel closed', 'info');
      }
    };
  }, [hardReload, getCurrentVersion, log]);

    // const debouncedCheckVersions = debounce(checkVersions, 3000, { leading: true, trailing: true });

// axios.interceptors.response.use(
//   (response) => {
//     debouncedCheckVersions();
//     return response;
//   },
//   (error) => {
//     debouncedCheckVersions();
//     return Promise.reject(error);
//   }
// );

  // Run version check on every route change
  useEffect(() => {
    if (!authToken) return;
    // call checkVersions on location change
    checkVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);


    useEffect(() => {
    if (!authToken) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        log('Tab visibility changed to visible - rechecking version', 'info');
        checkVersions();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authToken, checkVersions, log]);

  return null; // no UI

  
};

export default BackgroundVersionService;
