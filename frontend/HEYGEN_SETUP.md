# HeyGen Integration Setup

## Overview
PixelPaw now includes HeyGen API integration to create interactive avatar videos of your virtual pet companion, making the experience more engaging and lifelike.

## Setup Instructions

### 1. Get HeyGen API Key
1. Visit [HeyGen Dashboard](https://app.heygen.com)
2. Sign up or log in to your account
3. Navigate to API settings
4. Generate a new API key
5. Copy the API key for configuration

### 2. Configure API Key
You can configure your HeyGen API key in two ways:

#### Option A: Environment File
1. Open the `.env` file in the project root
2. Replace `your_heygen_api_key_here` with your actual API key:
   ```
   VITE_HEYGEN_API_KEY=your_actual_api_key_here
   ```

#### Option B: Settings Dialog (Recommended)
1. Run the application
2. Click the "Settings" button in the top-right corner
3. Enter your HeyGen API key
4. Click "Test Connection" to verify
5. Click "Save Settings"

### 3. Features Enabled
Once configured, you'll have access to:
- **Interactive Avatar Videos**: Generate videos of your pet speaking their responses
- **Real-time Video Generation**: Create videos from chat messages
- **Customizable Avatars**: Different avatar styles for each pet type
- **Voice Integration**: Text-to-speech with pet-appropriate voices

### 4. Usage
1. Chat with your pet as usual
2. The last pet message will be available for video generation
3. Click "Generate Video" in the Interactive Avatar panel
4. Wait for the video to be generated
5. Play the video to see your pet come to life!

### 5. Troubleshooting
- **API Key Issues**: Ensure your API key is valid and has sufficient credits
- **Network Errors**: Check your internet connection
- **Video Generation Fails**: Verify your HeyGen account has active credits
- **Settings Not Saving**: Check browser localStorage permissions

### 6. Layout Improvements
The interface now features:
- **Balanced 3-column layout** on desktop (4-4-4 grid)
- **Responsive design** that adapts to mobile and tablet screens
- **Interactive Avatar panel** in the left column
- **Reorganized components** for better visual balance

## API Limits
- Free tier: Limited video generations per month
- Paid tiers: Higher limits and premium features
- Check your HeyGen dashboard for current usage

## Support
For HeyGen-specific issues, contact HeyGen support.
For PixelPaw integration issues, check the application logs in browser developer tools.