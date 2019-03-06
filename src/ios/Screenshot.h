//
//  Screenshot.h
//
//  Created by Alexandru Lazar on 01/03/2019
//  Copyright 2019 MCRO ENGINEERING
//  MIT licensed
//

#import <Foundation/Foundation.h>
#import <QuartzCore/QuartzCore.h>
#import <Cordova/CDVPlugin.h>

@interface Screenshot : CDVPlugin {
}

- (void)saveScreenshot:(CDVInvokedUrlCommand*)command;
- (void)getScreenshotAsURI:(CDVInvokedUrlCommand*)command;
@end
