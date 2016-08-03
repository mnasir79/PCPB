Analytics Hub
=============

* * *
**Warning: Beta release. See open issues [here](https://bitbucket.org/eccemea/analytics-hub/issues?status=new&status=open)**
* * *

An easy to deploy and configure hub between PureCloud, CIC and dashboard applications and allow you to create dashboards without any development knowledge. This Chrome Extension pushes data from [PureCloud](https://www.inin.com/solutions/purecloud-platform) and/or [CIC](https://www.inin.com/customer-engagement/call-center-software) to [PowerBI](https://powerbi.microsoft.com/en-us/tour/).

![Clipboard01.jpg](https://bitbucket.org/repo/6pxRex/images/2536503936-Clipboard01.jpg)

*Limitations: currently, the Analytics Hub extension can only push queue-related data to PowerBI*
___

How to Install
--------------

* Requirements
    * PowerBI account: sign up [here](https://app.powerbi.com/signupredirect?pbi_source=web). Microsoft account required.
    * If you want to show PureCloud stats, you will need your own [PureCloud org](https://mypurecloud.com)
    * If you want to show CIC stats, a recent version (4.0 SU6+) of CIC


* Before installing the chrome extension, you need to configure a few things:
    * CIC (optional, only if you want to gather stats about CIC workgroups in PowerBI)
        * Create a dedicated admin user on your CIC server that will be used to query workgroup statistics
        * An ICWS license is required (same as IceLib)
    * PureCloud (optional, only if you want to gather stats about PureCloud queues in PowerBI)
        * Get your own PureCloud org [here](http://mypurecloud.com/)
        * Create a custom OAuth application in the PureCloud admin module and assign proper user rights to the user account which you are going to use with the Analytics Hub. [Learn more](https://developer.mypurecloud.com/api/rest/authorization/create-oauth-client-id.html). Make sure you add the "Developer" role to your user otherwise you will not see any OAuth option under Admin\Integrations.

* Now, you are ready to install the extension
    * Go to the app page: https://chrome.google.com/webstore/detail/inin-analytics-hub/ojgodpdmapceodglkfkbkmddkeibibmd
    * Click on "Add To Chrome"
    * Once installed, click on the app icon on the top right and select "Options"

![Clipboard02.jpg](https://bitbucket.org/repo/6pxRex/images/2483384794-Clipboard02.jpg)

___

Options
=======

PureCloud
---------

![Clipboard01.jpg](https://bitbucket.org/repo/6pxRex/images/448113993-Clipboard01.jpg)

* Environment: either mypurecloud.com (US & Canada), mypurecloud.ie (EMEA), mypurecloud.jp (Japan), mypurecloud.com.au (Australia) or ininsca.com (development - internal to ININ only)
* Client Id: Your oAuth client id from the oAuth page under Admin/Integrations in your PureCloud org

![Clipboard04.jpg](https://bitbucket.org/repo/6pxRex/images/2283939741-Clipboard04.jpg)

* Client Secret: Your oAuth client secret
* Timer: used to indicate the duration between 2 polls. Depending on the number of groups you have in PureCloud, having a value of less than 5000 (5 seconds) can cause high-CPU usage. A value of 10000 (10 seconds) is recommended.

CIC
---

![Clipboard02.jpg](https://bitbucket.org/repo/6pxRex/images/3630133645-Clipboard02.jpg)

* IC Server: well, duh! Use the server name or IP address to reach the CIC server from your machine
* Port: ICWS port, usually 8018 (HTTP) or 8019 (HTTPS)
* Username: CIC user you created earlier
* Password: Oh no, not 1234 again!
* Use SSL: Check this if you use HTTPS over port 8019
* Timer: Same as the PureCloud timer. Used to indicate the duration between 2 polls. Depending on the number of groups you have in PureCloud, having a value of less than 5000 (5 seconds) can cause high-CPU usage. A value of 10000 (10 seconds) is recommended.
* Optimize Output: If checked, only changes are pushed to PowerBI instead of the whole dataset.

## How to use
* Click on the Analytics Hub icon
* Click on PureCloud or CIC (or both) to connect to your systems. When successful, the buttons will turn green.

![Clipboard02.jpg](https://bitbucket.org/repo/6pxRex/images/3681545963-Clipboard02.jpg)

* Click on PowerBI to connect to... PowerBI. This should open a window where you will need to authenticate. Once successful, the PowerBI button will turn green

![Clipboard01.jpg](https://bitbucket.org/repo/6pxRex/images/3917787560-Clipboard01.jpg)

* Open your PowerBI dashboard. You should see new Datasets (PureCloud and/or CIC)

![Clipboard03.jpg](https://bitbucket.org/repo/6pxRex/images/2323723455-Clipboard03.jpg)

* Drag fields (on the right-side) and drop them onto your PowerBI dashboard

![Clipboard04.jpg](https://bitbucket.org/repo/6pxRex/images/2736214574-Clipboard04.jpg)

* Click on "Pin visual" to pin the widget to a report

![Clipboard05.jpg](https://bitbucket.org/repo/6pxRex/images/1555197348-Clipboard05.jpg)

* Open the dashboard and voilà!

**Note that widgets will only refresh after you pin them to a dashboard**

![Clipboard06.jpg](https://bitbucket.org/repo/6pxRex/images/568244831-Clipboard06.jpg)