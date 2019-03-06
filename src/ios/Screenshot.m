//
// Screenshot.m
//
//  Created by Alexandru Lazar on 01/03/2019
//  Copyright 2019 MCRO ENGINEERING
//  Improved by Mihai Chifor
//  MIT licensed
//

#import <Cordova/CDV.h>
#import "Screenshot.h"

@implementation Screenshot

@synthesize webView;

CGFloat statusBarHeight()
{
    CGSize statusBarSize = [[UIApplication sharedApplication] statusBarFrame].size;
    return MIN(statusBarSize.width, statusBarSize.height);
}

- (CGRect) getDefaultFrame {
    UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
    return [keyWindow bounds];
}

- (UIImage *)getScreenshot:(CGRect)imageFrame
{
    UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
    CGRect rect = [keyWindow bounds];
    UIGraphicsBeginImageContextWithOptions(rect.size, YES, 0);
    [keyWindow drawViewHierarchyInRect:keyWindow.bounds afterScreenUpdates:NO];
    UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    // cut the status bar from the screenshot
    CGRect smallRect = CGRectMake (imageFrame.origin.x, imageFrame.origin.y + statusBarHeight()*img.scale, imageFrame.size.width*img.scale, imageFrame.size.height * img.scale);

    CGImageRef subImageRef = CGImageCreateWithImageInRect(img.CGImage, smallRect);
    CGRect smallBounds = CGRectMake(0,0,CGImageGetWidth(subImageRef), CGImageGetHeight(subImageRef));

    UIGraphicsBeginImageContext(smallBounds.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextDrawImage(context,smallBounds,subImageRef);
    UIImage* cropped = [UIImage imageWithCGImage:subImageRef];
    UIGraphicsEndImageContext();

    CGImageRelease(subImageRef);

    return cropped;
}

- (void)saveScreenshot:(CDVInvokedUrlCommand*)command
{
    NSDictionary *json = [command.arguments objectAtIndex:0];
    NSString *filename = [json objectForKey:@"filename"];
    NSNumber *quality = [json objectForKey:@"quality"];
    NSString *imageFrame = [json objectForKey:@"frame"];

    CGRect imageRect;
    if (imageFrame) {
        NSArray *frameParams = [imageFrame componentsSeparatedByString:@" "];
        imageRect = CGRectMake([[frameParams objectAtIndex:0] integerValue], [[frameParams objectAtIndex:1] integerValue], [[frameParams objectAtIndex:2] integerValue], [[frameParams objectAtIndex:3] integerValue]);
    } else {
        imageRect = [self getDefaultFrame];
    }

    NSString *path = [NSString stringWithFormat:@"%@.jpg",filename];
    NSString *jpgPath = [NSTemporaryDirectory() stringByAppendingPathComponent:path];

    UIImage *image = [self getScreenshot: imageRect];
    NSData *imageData = UIImageJPEGRepresentation(image,[quality floatValue]);
    [imageData writeToFile:jpgPath atomically:NO];

    CDVPluginResult* pluginResult = nil;
    NSDictionary *jsonObj = [ [NSDictionary alloc]
                             initWithObjectsAndKeys :
                             jpgPath, @"filePath",
                             @"true", @"success",
                             nil
                             ];

    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
    NSString* callbackId = command.callbackId;
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
}

- (void) getScreenshotAsURI:(CDVInvokedUrlCommand*)command
{
    NSDictionary *json = [command.arguments objectAtIndex:0];
    NSNumber *quality = [json objectForKey:@"quality"];
    NSString *imageFrame = [json objectForKey:@"frame"];

    CGRect imageRect;
    if (imageFrame) {
        NSArray *frameParams = [imageFrame componentsSeparatedByString:@" "];
        imageRect = CGRectMake([[frameParams objectAtIndex:0] integerValue], [[frameParams objectAtIndex:1] integerValue], [[frameParams objectAtIndex:2] integerValue], [[frameParams objectAtIndex:3] integerValue]);
    } else {
        imageRect = [self getDefaultFrame];
    }

    UIImage *image = [self getScreenshot:imageRect];
    NSData *imageData = UIImageJPEGRepresentation(image,[quality floatValue]);
    NSString *base64Encoded = [imageData base64EncodedStringWithOptions:0];
    NSDictionary *jsonObj = @{
                              @"URI" : [NSString stringWithFormat:@"data:image/jpeg;base64,%@", base64Encoded]
                              };
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsonObj];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:[command callbackId]];
}
@end

