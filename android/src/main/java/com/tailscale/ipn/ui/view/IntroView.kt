// Copyright (c) Tailscale Inc & AUTHORS
// SPDX-License-Identifier: BSD-3-Clause

package com.tailscale.ipn.ui.view

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.tailscale.ipn.R
import com.tailscale.ipn.ui.theme.SpaceDarkBg
import com.tailscale.ipn.ui.theme.SpaceEmeraldLight
import com.tailscale.ipn.ui.theme.SpaceEmeraldPrimary
import com.tailscale.ipn.ui.theme.SpaceTextPrimary
import com.tailscale.ipn.ui.theme.SpaceTextSecondary
import kotlinx.coroutines.delay

@Composable
fun IntroView(onContinue: () -> Unit, onCorporateWizard: () -> Unit = {}) {
  LaunchedEffect(Unit) {
    delay(1200)
    onContinue()
  }

  Surface(modifier = Modifier.fillMaxSize(), color = SpaceDarkBg) {
    Box(modifier = Modifier.fillMaxSize()) {
      // Cover Background Image
      Image(
          painter = painterResource(id = R.drawable.cover),
          contentDescription = null,
          contentScale = ContentScale.Crop,
          modifier = Modifier.fillMaxSize())

      // Dark Overlay Gradient
      Box(
          modifier =
              Modifier.fillMaxSize()
                  .background(
                      Brush.verticalGradient(
                          colors =
                              listOf(
                                  SpaceDarkBg.copy(alpha = 0.7f),
                                  SpaceDarkBg.copy(alpha = 0.9f),
                                  SpaceDarkBg))))

      // Content
      Column(
          modifier = Modifier.fillMaxSize().padding(32.dp),
          horizontalAlignment = Alignment.CenterHorizontally,
          verticalArrangement = Arrangement.Center) {

            Text(
                text = "AngolanVPN",
                style =
                    MaterialTheme.typography.headlineLarge.copy(
                        fontWeight = FontWeight.ExtraBold, color = SpaceTextPrimary))

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Solução de Conectividade Segura & Encriptada",
                style = MaterialTheme.typography.bodyMedium.copy(color = SpaceEmeraldLight),
                textAlign = TextAlign.Center)

            Spacer(modifier = Modifier.height(48.dp))

            CircularProgressIndicator(
                modifier = Modifier.size(44.dp),
                color = SpaceEmeraldPrimary,
                strokeWidth = 3.5.dp)

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "A redirecionar para autenticação...",
                style =
                    MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold, color = SpaceTextPrimary),
                textAlign = TextAlign.Center)

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Por favor aguarde, será redirecionado para autenticar-se",
                style = MaterialTheme.typography.bodySmall.copy(color = SpaceTextSecondary),
                textAlign = TextAlign.Center)
          }
    }
  }
}
