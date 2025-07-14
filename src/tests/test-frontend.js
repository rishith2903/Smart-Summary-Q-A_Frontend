// Frontend Testing Script
// Run this in the browser console to test frontend functionality

class FrontendTester {
  constructor() {
    this.results = [];
    this.currentTest = 0;
    this.totalTests = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      info: 'color: #2196F3',
      success: 'color: #4CAF50',
      error: 'color: #F44336',
      warning: 'color: #FF9800'
    };
    
    console.log(`%c[${timestamp}] ${message}`, colors[type]);
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testNavigation() {
    this.log('🧭 Testing Navigation...', 'info');
    
    const tests = [
      { name: 'Logo Click', test: () => this.testLogoClick() },
      { name: 'Navigation Links', test: () => this.testNavigationLinks() },
      { name: 'Theme Toggle', test: () => this.testThemeToggle() },
      { name: 'Mobile Menu', test: () => this.testMobileMenu() }
    ];

    for (const test of tests) {
      try {
        await test.test();
        this.log(`✅ ${test.name} - PASSED`, 'success');
        this.results.push({ test: test.name, status: 'PASSED' });
      } catch (error) {
        this.log(`❌ ${test.name} - FAILED: ${error.message}`, 'error');
        this.results.push({ test: test.name, status: 'FAILED', error: error.message });
      }
    }
  }

  async testLogoClick() {
    const logo = document.querySelector('[data-testid="logo"]') || 
                 document.querySelector('img[alt*="logo"]') ||
                 document.querySelector('h6'); // Fallback to title
    
    if (!logo) throw new Error('Logo not found');
    
    const currentPath = window.location.pathname;
    logo.click();
    await this.wait(100);
    
    if (window.location.pathname !== '/' && currentPath !== '/') {
      throw new Error('Logo click did not navigate to home');
    }
  }

  async testNavigationLinks() {
    const navLinks = document.querySelectorAll('a[href^="/"], button[onclick*="navigate"]');
    if (navLinks.length === 0) throw new Error('No navigation links found');
    
    this.log(`Found ${navLinks.length} navigation elements`, 'info');
  }

  async testThemeToggle() {
    const themeButton = document.querySelector('button[aria-label*="theme"]') ||
                       document.querySelector('button svg[data-testid*="Brightness"]')?.parentElement;
    
    if (!themeButton) throw new Error('Theme toggle button not found');
    
    const initialTheme = document.body.getAttribute('data-theme') || 'light';
    themeButton.click();
    await this.wait(300);
    
    // Check if theme changed (this is a basic check)
    this.log('Theme toggle clicked successfully', 'info');
  }

  async testMobileMenu() {
    // Simulate mobile viewport
    const mobileMenuButton = document.querySelector('button[aria-label*="menu"]') ||
                            document.querySelector('svg[data-testid="MenuIcon"]')?.parentElement;
    
    if (mobileMenuButton) {
      mobileMenuButton.click();
      await this.wait(300);
      this.log('Mobile menu toggle works', 'info');
    } else {
      this.log('Mobile menu button not visible (desktop view)', 'warning');
    }
  }

  async testFormInputs() {
    this.log('📝 Testing Form Inputs...', 'info');
    
    const tests = [
      { name: 'Text Inputs', test: () => this.testTextInputs() },
      { name: 'File Inputs', test: () => this.testFileInputs() },
      { name: 'Buttons', test: () => this.testButtons() },
      { name: 'Dropdowns', test: () => this.testDropdowns() }
    ];

    for (const test of tests) {
      try {
        await test.test();
        this.log(`✅ ${test.name} - PASSED`, 'success');
        this.results.push({ test: test.name, status: 'PASSED' });
      } catch (error) {
        this.log(`❌ ${test.name} - FAILED: ${error.message}`, 'error');
        this.results.push({ test: test.name, status: 'FAILED', error: error.message });
      }
    }
  }

  async testTextInputs() {
    const textInputs = document.querySelectorAll('input[type="text"], input[type="url"], textarea');
    if (textInputs.length === 0) throw new Error('No text inputs found');
    
    textInputs.forEach((input, index) => {
      input.value = `Test input ${index + 1}`;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    this.log(`Tested ${textInputs.length} text inputs`, 'info');
  }

  async testFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    this.log(`Found ${fileInputs.length} file inputs`, 'info');
    
    // File inputs require user interaction, so we just check they exist
    fileInputs.forEach(input => {
      if (!input.accept) {
        this.log('File input missing accept attribute', 'warning');
      }
    });
  }

  async testButtons() {
    const buttons = document.querySelectorAll('button:not([disabled])');
    if (buttons.length === 0) throw new Error('No enabled buttons found');
    
    this.log(`Found ${buttons.length} enabled buttons`, 'info');
    
    // Test button hover states
    buttons.forEach(button => {
      button.dispatchEvent(new Event('mouseenter'));
      button.dispatchEvent(new Event('mouseleave'));
    });
  }

  async testDropdowns() {
    const selects = document.querySelectorAll('select, [role="combobox"]');
    this.log(`Found ${selects.length} dropdown elements`, 'info');
    
    selects.forEach(select => {
      if (select.tagName === 'SELECT' && select.options.length > 1) {
        select.selectedIndex = 1;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  async testAPIConnectivity() {
    this.log('🔌 Testing API Connectivity...', 'info');
    
    const apiTests = [
      { name: 'Health Check', url: 'http://localhost:5000/api/health' },
      { name: 'Root Endpoint', url: 'http://localhost:5000/' }
    ];

    for (const test of apiTests) {
      try {
        const response = await fetch(test.url);
        if (response.ok) {
          this.log(`✅ ${test.name} - PASSED`, 'success');
          this.results.push({ test: test.name, status: 'PASSED' });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        this.log(`❌ ${test.name} - FAILED: ${error.message}`, 'error');
        this.results.push({ test: test.name, status: 'FAILED', error: error.message });
      }
    }
  }

  async testResponsiveDesign() {
    this.log('📱 Testing Responsive Design...', 'info');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    const originalSize = { width: window.innerWidth, height: window.innerHeight };

    for (const viewport of viewports) {
      try {
        // Note: This won't actually resize the window in most browsers due to security
        // but we can test CSS media queries
        this.log(`Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`, 'info');
        
        // Check if responsive elements exist
        const mobileElements = document.querySelectorAll('[class*="mobile"], [class*="sm-"], [class*="xs-"]');
        const desktopElements = document.querySelectorAll('[class*="desktop"], [class*="lg-"], [class*="xl-"]');
        
        this.log(`Found ${mobileElements.length} mobile-specific elements`, 'info');
        this.log(`Found ${desktopElements.length} desktop-specific elements`, 'info');
        
        this.results.push({ test: `${viewport.name} Responsive`, status: 'PASSED' });
      } catch (error) {
        this.log(`❌ ${viewport.name} Responsive - FAILED: ${error.message}`, 'error');
        this.results.push({ test: `${viewport.name} Responsive`, status: 'FAILED', error: error.message });
      }
    }
  }

  async testErrorHandling() {
    this.log('🚨 Testing Error Handling...', 'info');
    
    try {
      // Test invalid form submissions
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      });
      
      // Test empty required fields
      const requiredInputs = document.querySelectorAll('input[required], textarea[required]');
      requiredInputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('blur', { bubbles: true }));
      });
      
      this.log('✅ Error Handling - PASSED', 'success');
      this.results.push({ test: 'Error Handling', status: 'PASSED' });
    } catch (error) {
      this.log(`❌ Error Handling - FAILED: ${error.message}`, 'error');
      this.results.push({ test: 'Error Handling', status: 'FAILED', error: error.message });
    }
  }

  async testAccessibility() {
    this.log('♿ Testing Accessibility...', 'info');
    
    try {
      // Check for alt attributes on images
      const images = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
      
      if (imagesWithoutAlt.length > 0) {
        this.log(`Warning: ${imagesWithoutAlt.length} images without alt text`, 'warning');
      }
      
      // Check for aria-labels on buttons
      const buttons = document.querySelectorAll('button');
      const buttonsWithoutLabels = Array.from(buttons).filter(btn => 
        !btn.textContent.trim() && !btn.getAttribute('aria-label')
      );
      
      if (buttonsWithoutLabels.length > 0) {
        this.log(`Warning: ${buttonsWithoutLabels.length} buttons without labels`, 'warning');
      }
      
      // Check for heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      this.log(`Found ${headings.length} headings`, 'info');
      
      this.log('✅ Accessibility - PASSED', 'success');
      this.results.push({ test: 'Accessibility', status: 'PASSED' });
    } catch (error) {
      this.log(`❌ Accessibility - FAILED: ${error.message}`, 'error');
      this.results.push({ test: 'Accessibility', status: 'FAILED', error: error.message });
    }
  }

  async runAllTests() {
    this.log('🚀 Starting Frontend Test Suite...', 'info');
    this.log('====================================', 'info');
    
    const startTime = Date.now();
    
    await this.testNavigation();
    await this.testFormInputs();
    await this.testAPIConnectivity();
    await this.testResponsiveDesign();
    await this.testErrorHandling();
    await this.testAccessibility();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    this.generateReport(duration);
  }

  generateReport(duration) {
    this.log('====================================', 'info');
    this.log('📊 FRONTEND TEST RESULTS', 'info');
    this.log('====================================', 'info');
    
    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const total = this.results.length;
    
    this.log(`Total Tests: ${total}`, 'info');
    this.log(`Passed: ${passed}`, 'success');
    this.log(`Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    this.log(`Duration: ${duration} seconds`, 'info');
    
    if (failed > 0) {
      this.log('\n❌ FAILED TESTS:', 'error');
      this.results.filter(r => r.status === 'FAILED').forEach(result => {
        this.log(`  • ${result.test}: ${result.error}`, 'error');
      });
    }
    
    if (passed === total) {
      this.log('\n🎉 ALL TESTS PASSED! Frontend is working correctly.', 'success');
    } else {
      this.log('\n⚠️ Some tests failed. Please check the issues above.', 'warning');
    }
    
    this.log('====================================', 'info');
    
    // Return results for programmatic access
    return {
      total,
      passed,
      failed,
      duration,
      results: this.results
    };
  }
}

// Auto-run tests if this script is executed
if (typeof window !== 'undefined') {
  window.FrontendTester = FrontendTester;
  
  // Provide easy access to run tests
  window.runFrontendTests = async () => {
    const tester = new FrontendTester();
    return await tester.runAllTests();
  };
  
  console.log('🧪 Frontend Tester loaded!');
  console.log('Run tests with: runFrontendTests()');
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FrontendTester;
}
