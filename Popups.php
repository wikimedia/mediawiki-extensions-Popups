<?php
/*
 * This file is part of the MediaWiki extension Popups.
 *
 * Popups is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Popups is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Popups.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This extension requires that the PageImages and TextExtracts
 * extensions have also been installed.
 *
 * Install BetaFeatures if you don't want Popups to load for all users.
 *
 * @file
 * @ingroup extensions
 */

$wgExtensionCredits['betafeatures'][] = array(
	'author' => array( 'Prateek Saxena', 'Yair Rand' ),
	'descriptionmsg' => 'popups-desc',
	'name' => 'Popups',
	'path' => __FILE__,
	'url' => 'https://www.mediawiki.org/wiki/Extension:Popups',
	'license-name' => 'GPL-2.0+',
);

$wgPopupsSurveyLink = false;
$wgConfigRegistry['popups'] = 'GlobalVarConfig::newInstance';

$wgAutoloadClasses['PopupsHooks'] = __DIR__ . '/Popups.hooks.php';
$wgMessagesDirs['Popups'] = __DIR__ . '/i18n';
$wgExtensionMessagesFiles['Popups'] = __DIR__ . '/Popups.i18n.php';

$wgHooks['GetBetaFeaturePreferences'][] = 'PopupsHooks::getPreferences';
$wgHooks['BeforePageDisplay'][] = 'PopupsHooks::onBeforePageDisplay';
$wgHooks['ResourceLoaderTestModules'][] = 'PopupsHooks::onResourceLoaderTestModules';
$wgHooks['EventLoggingRegisterSchemas'][] = 'PopupsHooks::onEventLoggingRegisterSchemas';
$wgHooks['ResourceLoaderRegisterModules'][] = 'PopupsHooks::onResourceLoaderRegisterModules';
$wgHooks['ResourceLoaderGetConfigVars'][] = 'PopupsHooks::onResourceLoaderGetConfigVars';
